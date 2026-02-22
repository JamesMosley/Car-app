from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
import database
import models
import schemas
from payment_service import MpesaService, StripeService

router = APIRouter(
    prefix="/pay",
    tags=["Payment"]
)

@router.post("/mpesa/stkpush")
def initiate_mpesa_payment(req: schemas.MpesaPaymentRequest, db: Session = Depends(database.get_db)):
    payment = models.Payment(
        amount=req.amount,
        currency="KES",
        method="MPESA",
        status="PENDING",
        phone_number=req.phone_number
    )
    db.add(payment)
    db.commit()
    db.refresh(payment)
    
    response = MpesaService.trigger_stk_push(req.phone_number, req.amount, payment.id)
    if response and response.get("ResponseCode") == "0":
        return {"status": "success", "message": "STK Push sent", "payment_id": payment.id, "provider_response": response}
    else:
        payment.status = "FAILED"
        db.commit()
        raise HTTPException(status_code=400, detail="Failed to initiate STK push")

@router.post("/mpesa/callback")
async def mpesa_callback(request: Request, db: Session = Depends(database.get_db)):
    data = await request.json()
    print("M-Pesa Callback Data:", data)
    # Callback logic to update payment status would go here based on M-pesa Daraja response
    return {"result": "success"}

@router.post("/stripe/intent")
def create_stripe_intent(req: schemas.StripePaymentRequest, db: Session = Depends(database.get_db)):
    payment = models.Payment(
        amount=req.amount,
        currency=req.currency,
        method="CARD",
        status="PENDING"
    )
    db.add(payment)
    db.commit()
    db.refresh(payment)
    
    intent = StripeService.create_payment_intent(req.amount, req.currency)
    if not intent:
        payment.status = "FAILED"
        db.commit()
        raise HTTPException(status_code=400, detail="Failed to create PaymentIntent")
    
    payment.transaction_id = intent.id
    db.commit()
    
    return {"status": "success", "client_secret": intent.client_secret, "payment_id": payment.id}
