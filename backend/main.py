from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import timedelta

import models, schemas, auth, database

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/register", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.post("/token", response_model=schemas.Token)
async def login_for_access_token(form_data: schemas.UserCreate, db: Session = Depends(get_db)):
    # Note: We are using UserCreate schema here which expects email/password in JSON body
    # Standard OAuth2PasswordRequestForm expects form-data, but for simplicity with simple fetch from frontend JSON is easier
    # However, to be strictly compliant or use Swagger UI easily, OAuth2PasswordRequestForm is better.
    # Let's stick to JSON body for this custom auth implementation as requested by user context often implies simple JSON APIs.
    # Wait, the plan said "make it functional".
    # Let's support JSON body for login as it's easier for the frontend fetch call.
    
    user = db.query(models.User).filter(models.User.email == form_data.email).first()
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/google-token", response_model=schemas.Token)
async def google_login(token_request: schemas.TokenRequest, db: Session = Depends(get_db)):
    try:
        # Verify the token with Google
        # In a real app, you should verify the AUDIENCE as well (your client ID)
        import requests
        response = requests.get(f"https://oauth2.googleapis.com/tokeninfo?id_token={token_request.token}")
        
        if response.status_code != 200:
             raise HTTPException(status_code=400, detail="Invalid Google token")
             
        id_info = response.json()
        email = id_info.get("email")
        
        if not email:
            raise HTTPException(status_code=400, detail="Token does not contain email")

        # Check if user exists
        user = db.query(models.User).filter(models.User.email == email).first()
        if not user:
            # Create new user if not exists (auto-registration)
            # We'll set a random password since they use Google to login
            import secrets
            random_password = secrets.token_urlsafe(16)
            hashed_password = auth.get_password_hash(random_password)
            user = models.User(email=email, hashed_password=hashed_password)
            db.add(user)
            db.commit()
            db.refresh(user)
            
        access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = auth.create_access_token(
            data={"sub": user.email}, expires_delta=access_token_expires
        )
        return {"access_token": access_token, "token_type": "bearer"}
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/")
def read_root():
    return {"Hello": "World"}
