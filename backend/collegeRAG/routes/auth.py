from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
from pymongo import MongoClient
from bson import ObjectId

from ..models import User, UserInDB, UserCreate, Token, UserCreateWithDetails
from ..auth import (
    get_password_hash, 
    authenticate_user, 
    create_access_token,
    ACCESS_TOKEN_EXPIRE_MINUTES,
    users_collection
)

router = APIRouter(prefix="/auth", tags=["authentication"])

@router.post("/register", response_model=User)
async def register_user(user: UserCreateWithDetails):
    # Check if user already exists
    if users_collection.find_one({"email": user.email}):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    hashed_password = get_password_hash(user.password)
    db_user = {
        "email": user.email,
        "full_name": user.full_name,
        "hashed_password": hashed_password,
        "education_level": user.education_level,
        "stream": user.stream,
        "goal": user.goal,
        "specialization": user.specialization
    }
    
    # Insert user into database
    result = users_collection.insert_one(db_user)
    
    # Return the created user (without password)
    return {
        "id": str(result.inserted_id),
        "email": user.email,
        "full_name": user.full_name,
        "education_level": user.education_level,
        "stream": user.stream,
        "goal": user.goal,
        "specialization": user.specialization
    }

@router.post("/login", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["email"]}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer}"}

@router.get("/me", response_model=User)
async def read_users_me(current_user: dict = Depends(get_current_user)):
    return current_user
