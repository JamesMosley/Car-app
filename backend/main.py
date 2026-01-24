from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import timedelta

import models, schemas, auth, database

# =========================================================
# Database
# =========================================================

models.Base.metadata.create_all(bind=database.engine)

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# =========================================================
# App
# =========================================================

app = FastAPI(
    title="Auth API",
    version="1.0.0",
)

# =========================================================
# CORS — EASY DEVELOPMENT MODE
# =========================================================
# This guarantees:
# - No OPTIONS 400s
# - Works from ANY localhost/port
# - Works with fetch / axios / browser
#
# Tighten origins later for production.
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],      # DEV ONLY
    allow_credentials=False,  # True only if using cookies
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================================================
# Routes
# =========================================================

@app.get("/")
def health():
    return {"status": "ok"}

# ---------------------------------------------------------
# Register
# ---------------------------------------------------------

@app.post("/register", response_model=schemas.User)
def register(
    user: schemas.UserCreate,
    db: Session = Depends(get_db),
):
    if db.query(models.User).filter(
        models.User.email == user.email
    ).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    new_user = models.User(
        email=user.email,
        hashed_password=auth.get_password_hash(user.password),
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user

# ---------------------------------------------------------
# Login (JSON)
# ---------------------------------------------------------

@app.post("/login", response_model=schemas.Token)
def login(
    credentials: schemas.UserCreate,
    db: Session = Depends(get_db),
):
    user = db.query(models.User).filter(
        models.User.email == credentials.email
    ).first()

    if not user or not auth.verify_password(
        credentials.password,
        user.hashed_password,
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    access_token = auth.create_access_token(
        data={"sub": user.email},
        expires_delta=timedelta(
            minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES
        ),
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
    }

# ---------------------------------------------------------
# Google Login
# ---------------------------------------------------------

@app.post("/google-login", response_model=schemas.Token)
def google_login(
    token_request: schemas.TokenRequest,
    db: Session = Depends(get_db),
):
    import requests, secrets

    response = requests.get(
        "https://oauth2.googleapis.com/tokeninfo",
        params={"id_token": token_request.token},
    )

    if response.status_code != 200:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid Google token",
        )

    email = response.json().get("email")
    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Google token missing email",
        )

    user = db.query(models.User).filter(
        models.User.email == email
    ).first()

    if not user:
        user = models.User(
            email=email,
            hashed_password=auth.get_password_hash(
                secrets.token_urlsafe(16)
            ),
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    access_token = auth.create_access_token(
        data={"sub": user.email},
        expires_delta=timedelta(
            minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES
        ),
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
    }
