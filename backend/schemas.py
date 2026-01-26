from pydantic import BaseModel, EmailStr

# ---------- USER SCHEMAS ----------

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(BaseModel):
    id: int
    email: EmailStr

    class Config:
        from_attributes = True

# ---------- TOKEN SCHEMAS ----------

class Token(BaseModel):
    access_token: str
    token_type: str
    
class TokenRequest(BaseModel):
    email: EmailStr
    password: str
