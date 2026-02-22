import os
import requests
from requests.auth import HTTPBasicAuth
from datetime import datetime
import base64
import stripe

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

class MpesaService:
    @staticmethod
    def get_access_token():
        consumer_key = os.getenv("MPESA_CONSUMER_KEY")
        consumer_secret = os.getenv("MPESA_CONSUMER_SECRET")
        api_url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
        
        try:
            r = requests.get(api_url, auth=HTTPBasicAuth(consumer_key, consumer_secret))
            r.raise_for_status() # Raise exception for 4XX/5XX responses
            return r.json().get("access_token")
        except Exception as e:
            print("Error getting M-Pesa token:", e)
            if 'r' in locals():
                print(f"Response status: {r.status_code}")
                print(f"Response text: {r.text}")
            return None

    @staticmethod
    def trigger_stk_push(phone_number: str, amount: int, db_payment_id: int):
        access_token = MpesaService.get_access_token()
        if not access_token:
            return None
        
        api_url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
        headers = {"Authorization": f"Bearer {access_token}"}
        
        business_shortcode = os.getenv("MPESA_BUSINESS_SHORTCODE")
        passkey = os.getenv("MPESA_PASSKEY")
        
        if not business_shortcode or not passkey:
            print("Missing M-Pesa environment variables")
            return None
            
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        password = base64.b64encode(f"{business_shortcode}{passkey}{timestamp}".encode()).decode('utf-8')
        callback_url = os.getenv("MPESA_CALLBACK_URL", "https://mydomain.com/pay/mpesa/callback")
        
        payload = {
            "BusinessShortCode": business_shortcode,
            "Password": password,
            "Timestamp": timestamp,
            "TransactionType": "CustomerPayBillOnline",
            "Amount": amount,
            "PartyA": phone_number,
            "PartyB": business_shortcode,
            "PhoneNumber": phone_number,
            "CallBackURL": callback_url,
            "AccountReference": f"Payment-{db_payment_id}",
            "TransactionDesc": "Payment for Service"
        }
        
        try:
            r = requests.post(api_url, json=payload, headers=headers)
            return r.json()
        except Exception as e:
            print("Error triggering STK push:", e)
            return None

class StripeService:
    @staticmethod
    def create_payment_intent(amount: int, currency: str = "usd"):
        try:
            # Stripe amount is in smallest unit (e.g. cents)
            intent = stripe.PaymentIntent.create(
                amount=amount * 100,
                currency=currency,
                automatic_payment_methods={"enabled": True},
            )
            return intent
        except Exception as e:
            print("Error creating Stripe intent:", e)
            return None
