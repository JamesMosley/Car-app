from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import timedelta

import models, schemas, crud, auth
from database import engine, get_db

# =========================================================
# Database
# =========================================================

models.Base.metadata.create_all(bind=engine)

# =========================================================
# App
# =========================================================

app = FastAPI(
    title="Auth API",
    version="1.0.0",
)

# =========================================================
# CORS (DEV MODE)
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],       # tighten in prod
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================================================
# Health Check
# =========================================================

@app.get("/")
def health():
    return {"status": "ok"}

# =========================================================
# Signup
# =========================================================

@app.post("/signup", status_code=status.HTTP_201_CREATED)
def signup(
    user: schemas.UserCreate,
    db: Session = Depends(get_db),
):
    if crud.get_user_by_email(db, user.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    crud.create_user(db, user.email, user.password)
    return {"message": "User created successfully"}

# =========================================================
# Login
# =========================================================

@app.post("/token", response_model=schemas.Token)
def login(
    user: schemas.UserLogin,
    db: Session = Depends(get_db),
):
    db_user = crud.get_user_by_email(db, user.email)

    if not db_user or not auth.verify_password(
        user.password,
        db_user.hashed_password,
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = auth.create_access_token(
        data={"sub": db_user.email},
        expires_delta=timedelta(
            minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES
        ),
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
    }
