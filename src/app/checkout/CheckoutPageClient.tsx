"use client";

import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import { useStore } from "../../../stores/useStore";
import { formatPrice } from "@/lib/utils";
import { CartItem } from "../../../stores/useStore";
import CheckoutForm from "./CheckoutForm";
import { Card } from "@/components/ui/card";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const CheckoutPageClient = () => {
  const [clientSecret, setClientSecret] = useState("");
  const { cartItems } = useStore();

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: cartItems }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, [cartItems]);

  const appearance = {
    theme: "stripe" as const,
  };
  const options = {
    clientSecret,
    appearance,
  };

  const subtotal = cartItems.reduce(
    (acc: number, item: CartItem) => acc + parseFloat(item.price) * item.quantity,
    0
  );

  return (
    <div className="mx-auto p-4 flex flex-col items-center justify-center">
      <h1 className="text-xl md:text-3xl tracking-widest font-normal my-4">Checkout</h1>
      <Card className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
        <div className="flex flex-col justify-center">
          <h2 className="text-xl font-semibold mb-2">Order Summary</h2>
          <div className="space-y-3">
            {cartItems.map((item: CartItem, i) => (
              <div key={i} className="flex justify-between ">
                <span>
                  {item.name} x {item.quantity}
                </span>
                <span className="ml-2">{formatPrice(parseFloat(item.price) * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="border-t mt-2 pt-2">
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
          </div>
        </div>
        <div>
          {clientSecret && (
            <Elements options={options} stripe={stripePromise}>
              <CheckoutForm />
            </Elements>
          )}
        </div>
      </Card>
     
    </div>
  );
};

export default CheckoutPageClient;
