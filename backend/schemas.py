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
    
    password: str

# ---------- PAYMENT SCHEMAS ----------

class PaymentCreate(BaseModel):
    amount: int
    currency: str = "KES"
    method: str
    phone_number: str | None = None

class MpesaPaymentRequest(BaseModel):
    amount: int
    phone_number: str # Format: 2547XXXXXXXX

class StripePaymentRequest(BaseModel):
    amount: int
    currency: str = "usd"

class PaymentResponse(BaseModel):
    id: int
    status: str
    message: str
