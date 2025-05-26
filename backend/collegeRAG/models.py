from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class UserBase(BaseModel):
    email: EmailStr
    full_name: str

class UserCreate(UserBase):
    password: str

class UserInDB(UserBase):
    hashed_password: str

class User(UserBase):
    id: str
    education_level: Optional[str] = None
    stream: Optional[str] = None
    goal: Optional[str] = None
    specialization: Optional[str] = None

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    education_level: Optional[str] = None
    stream: Optional[str] = None
    goal: Optional[str] = None
    specialization: Optional[str] = None

class ChecklistItem(BaseModel):
    id: str
    type: str
    title: str

class ChecklistTemplate(BaseModel):
    stream: str
    goal: str
    specialization: str
    title: str
    items: List[ChecklistItem]

class UserCreateWithDetails(UserCreate):
    education_level: str
    stream: str
    goal: str
    specialization: str

class ItemStatusUpdate(BaseModel):
    completed: bool
