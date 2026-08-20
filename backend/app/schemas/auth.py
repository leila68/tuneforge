import uuid
from datetime import datetime

from pydantic import BaseModel, EmailStr, ConfigDict


class SignupRequest(BaseModel):
    email: EmailStr
    password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserOut(BaseModel):
    """What we send back when returning a user -- never the password hash."""
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    email: EmailStr
    created_at: datetime
    is_active: bool
    
