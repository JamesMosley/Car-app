from sqlalchemy import Boolean, Column, Integer, String
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)

class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Integer, nullable=False)
    currency = Column(String(10), default="KES")
    method = Column(String(50), nullable=False) # MPESA, CARD
    status = Column(String(50), default="PENDING") # PENDING, COMPLETED, FAILED
    transaction_id = Column(String(255), nullable=True, index=True) # M-Pesa Receipt or Stripe Intent ID
    phone_number = Column(String(50), nullable=True) # For M-Pesa
