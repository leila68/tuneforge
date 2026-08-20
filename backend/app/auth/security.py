"""
Custom JWT authentication -- built in-house rather than outsourced to a
BaaS auth provider. Uses passlib for password hashing and python-jose
for JWT encode/decode.
"""

import os
from datetime import datetime, timedelta, timezone

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from app.models.database import get_db
from app.models.user import User

SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "change-me-in-.env")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24h

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Points Swagger's "Authorize" button at /auth/login; also extracts the
# bearer token from the Authorization header on protected routes.
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")


def hash_password(plain_password: str) -> str:
    return pwd_context.hash(plain_password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(subject: str, expires_delta: timedelta | None = None) -> str:
    expire = datetime.now(timezone.utc) + (
        expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    payload = {"sub": subject, "exp": expire}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def decode_access_token(token: str) -> dict:
    return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    """
    Dependency for protected routes. Decodes the bearer token, looks up
    the user in Postgres, and returns it -- or raises 401.

    Usage in any route that needs to know who's asking:
        @router.get("/")
        def list_projects(current_user: User = Depends(get_current_user)):
            ...
    """
    credentials_error = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = decode_access_token(token)
        email: str | None = payload.get("sub")
        if email is None:
            raise credentials_error
    except JWTError:
        raise credentials_error

    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise credentials_error
    return user

# Same as oauth2_scheme, but auto_error=False means it returns None
# instead of raising 401 when there's no token — lets a route work
# for both guests and logged-in users.
oauth2_scheme_optional = OAuth2PasswordBearer(tokenUrl="auth/login", auto_error=False)


def get_current_user_optional(
    token: str | None = Depends(oauth2_scheme_optional),
    db: Session = Depends(get_db),
) -> User | None:
    """
    Dependency for routes that work for everyone, but personalize
    if the user happens to be logged in. Never raises -- worst case
    returns None and the route treats the caller as a guest.

    Usage:
        @router.get("/")
        def list_projects(current_user: User | None = Depends(get_current_user_optional)):
            if current_user is None:
                ... guest path ...
    """
    if token is None:
        return None
    try:
        payload = decode_access_token(token)
        email: str | None = payload.get("sub")
        if email is None:
            return None
    except JWTError:
        return None

    return db.query(User).filter(User.email == email).first()
