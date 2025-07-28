# backend/app/auth.py

import os
from datetime import datetime, timedelta
from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext
from app.db.mongo import db
from app.models import UserModel

# Router
router = APIRouter()
print("✅ auth.py router loaded")

# Password Hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT config
SECRET_KEY = os.getenv("JWT_SECRET", "secret-key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 1 day

# Token handling
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/login")

# Pydantic Models
class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

# Helpers
def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# Authenticated user retrieval from token
async def get_current_user(token: str = Depends(oauth2_scheme)) -> UserModel:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if not email:
            raise HTTPException(status_code=401, detail="Invalid token")

        users = db["users"]
        user_data = await users.find_one({"email": email})
        if not user_data:
            raise HTTPException(status_code=404, detail="User not found")

        return UserModel.from_mongo(user_data)


    except JWTError:
        raise HTTPException(status_code=401, detail="Token is invalid or expired")

# Routes
@router.post("/signup", status_code=201)
async def signup(user: UserCreate):
    print(f"📨 Signup attempt for: {user.email}")
    users = db["users"]
    existing = await users.find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="User already exists")

    hashed = get_password_hash(user.password)
    await users.insert_one({"email": user.email, "password": hashed})
    token = create_access_token({"sub": user.email})
    return {"token": token}

@router.post("/login", response_model=TokenResponse)
async def login(user: UserLogin):
    users = db["users"]
    db_user = await users.find_one({"email": user.email})
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": user.email})
    return TokenResponse(access_token=token)
