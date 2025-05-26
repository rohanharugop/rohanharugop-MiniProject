from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from typing import Optional
import os
from dotenv import load_dotenv

from routes import user, checklist, auth
from auth import get_current_user

# Load environment variables
load_dotenv()

app = FastAPI(
    title="Career Path API",
    description="API for Career Path Checklist Application",
    version="1.0.0"
)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(user.router, prefix="/api")
app.include_router(checklist.router, prefix="/api")

# OAuth2 scheme for token authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

@app.get("/")
async def root():
    return {"message": "Career Path Checklist API is running."}

# Protected route example
@app.get("/api/me")
async def read_users_me(current_user: dict = Depends(get_current_user)):
    return current_user

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Add error handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )

# Add startup event to ensure indexes
@app.on_event("startup")
async def startup_db_client():
    # Ensure indexes for better query performance
    from pymongo import IndexModel, ASCENDING, DESCENDING
    from db import users
    
    # Create indexes
    users.create_indexes([
        IndexModel([("email", ASCENDING)], unique=True),
        IndexModel([("created_at", DESCENDING)])
    ])
