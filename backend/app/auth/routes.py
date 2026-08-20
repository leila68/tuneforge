from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth.security import create_access_token, get_current_user, hash_password, verify_password
from app.models.database import get_db
from app.models.user import User
from app.schemas.auth import LoginRequest, SignupRequest, TokenResponse, UserOut

router = APIRouter()


@router.post("/signup", response_model=TokenResponse)
def signup(payload: SignupRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    user = User(email=payload.email, hashed_password=hash_password(payload.password))
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token(subject=user.email)
    return TokenResponse(access_token=token)


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    token = create_access_token(subject=user.email)
    return TokenResponse(access_token=token)


@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    """Confirms the token works end to end -- also handy for the frontend to fetch profile info."""
    return current_user
