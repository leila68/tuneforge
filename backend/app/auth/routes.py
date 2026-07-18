from fastapi import APIRouter, HTTPException, status

from app.auth.security import create_access_token, hash_password, verify_password
from app.schemas.auth import LoginRequest, SignupRequest, TokenResponse

router = APIRouter()

# TODO: replace with real DB lookups once models/db session are wired up
_fake_users_db: dict[str, dict] = {}


@router.post("/signup", response_model=TokenResponse)
def signup(payload: SignupRequest):
    if payload.email in _fake_users_db:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    _fake_users_db[payload.email] = {
        "email": payload.email,
        "hashed_password": hash_password(payload.password),
    }
    token = create_access_token(subject=payload.email)
    return TokenResponse(access_token=token)


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest):
    user = _fake_users_db.get(payload.email)
    if not user or not verify_password(payload.password, user["hashed_password"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    token = create_access_token(subject=payload.email)
    return TokenResponse(access_token=token)
