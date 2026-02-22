"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

// Ensure STRIPE_PUBLISHABLE_KEY is in Next.js environment!
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
    "pk_test_TYooMQauvdEDq54NiTphI7jx",
);

const StripeCheckoutForm = ({
  amount,
  onSuccess,
}: {
  amount: number;
  onSuccess: () => void;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError("");

    // Create PaymentIntent on backend
    const res = await fetch("http://127.0.0.1:8000/pay/stripe/intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: amount, currency: "usd" }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.detail || "Failed to initialize payment");
      setLoading(false);
      return;
    }

    const clientSecret = data.client_secret;
    const cardElement = elements.getElement(CardElement);

    if (cardElement) {
      const { paymentIntent, error: stripeError } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
          },
        });

      if (stripeError) {
        setError(stripeError.message || "Payment failed");
      } else if (paymentIntent?.status === "succeeded") {
        onSuccess();
      }
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-3 border rounded-md">
        <CardElement options={{ style: { base: { fontSize: "16px" } } }} />
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <Button type="submit" disabled={!stripe || loading} className="w-full">
        {loading ? "Processing..." : `Pay $${amount}`}
      </Button>
    </form>
  );
};

export const PaymentModal = ({
  isOpen,
  onClose,
  amount,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  onSuccess: (method: string) => void;
}) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [mpesaLoading, setMpesaLoading] = useState(false);
  const [mpesaMsg, setMpesaMsg] = useState("");

  const handleMpesaPay = async () => {
    setMpesaLoading(true);
    setMpesaMsg("");
    try {
      const res = await fetch("http://127.0.0.1:8000/pay/mpesa/stkpush", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, phone_number: phoneNumber }),
      });
      const data = await res.json();
      if (res.ok) {
        setMpesaMsg("STK Push sent to your phone. Completing payment...");
        setTimeout(() => {
          onSuccess("Mpesa");
          onClose();
        }, 3000); // Simulate waiting for confirmation or user action
      } else {
        setMpesaMsg(data.detail || "Failed to send STK push");
      }
    } catch (err) {
      setMpesaMsg("Network error.");
    }
    setMpesaLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Complete Payment</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="mpesa" className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="mpesa">M-Pesa</TabsTrigger>
            <TabsTrigger value="card">Credit Card</TabsTrigger>
          </TabsList>

          <TabsContent value="mpesa" className="space-y-4 mt-4">
            <div className="grid gap-2">
              <Label htmlFor="phone">M-Pesa Phone Number</Label>
              <Input
                id="phone"
                placeholder="2547XXXXXXXX"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
            {mpesaMsg && (
              <div className="text-sm text-muted-foreground">{mpesaMsg}</div>
            )}
            <Button
              onClick={handleMpesaPay}
              disabled={mpesaLoading || !phoneNumber}
              className="w-full"
            >
              {mpesaLoading ? "Initiating..." : `Pay KES ${amount} via M-Pesa`}
            </Button>
          </TabsContent>

          <TabsContent value="card" className="mt-4">
            <Elements stripe={stripePromise}>
              <StripeCheckoutForm
                amount={amount}
                onSuccess={() => {
                  onSuccess("Credit Card");
                  onClose();
                }}
              />
            </Elements>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
