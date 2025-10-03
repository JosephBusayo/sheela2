"use client";

import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { ShoppingBag, Lock } from "lucide-react";

import { useStore } from "../../../stores/useStore";
import { formatPrice } from "@/lib/utils";
import { CartItem } from "../../../stores/useStore";
import CheckoutForm from "./CheckoutForm";
import { Card } from "@/components/ui/card";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

const CheckoutPageClient = () => {
  const [clientSecret, setClientSecret] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { cartItems } = useStore();

  useEffect(() => {
    if (!cartItems || cartItems.length === 0) {
      setIsLoading(false);
      return;
    }

    // Create PaymentIntent as soon as the page loads
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: cartItems }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to create payment intent");
        }
        return res.json();
      })
      .then((data) => {
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          console.error("No client secret received");
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error creating payment intent:", error);
        setIsLoading(false);
      });
  }, []);

  const appearance = {
    theme: "stripe" as const,
    variables: {
      colorPrimary: "#3b82f6",
      colorBackground: "#ffffff",
      colorText: "#1f2937",
      colorDanger: "#ef4444",
      fontFamily: "system-ui, sans-serif",
      spacingUnit: "4px",
      borderRadius: "8px",
    },
  };
  
  const options = {
    clientSecret,
    appearance,
  };

  const subtotal = cartItems.reduce(
    (acc: number, item: CartItem) => acc + parseFloat(item.price) * item.quantity,
    0
  );

  const shipping = 0; // Free shipping
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <ShoppingBag className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Secure Checkout
            </h1>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <Lock className="w-4 h-4" />
            <p>Your payment information is secure and encrypted</p>
          </div>
        </div>

        {/* Main Content */}
        <Card className="overflow-hidden shadow-xl border-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Order Summary Section */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 lg:p-10">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">
                Order Summary
              </h2>
              
              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {cartItems.map((item: CartItem, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-start p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatPrice(parseFloat(item.price) * item.quantity)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {formatPrice(parseFloat(item.price))} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 pt-6 border-t border-gray-300">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span className="font-medium text-green-600">
                    {shipping === 0 ? "FREE" : formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tax (10%)</span>
                  <span className="font-medium">{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-900 pt-3 border-t border-gray-300">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="mt-8 pt-6 border-t border-gray-300">
                <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    <span>SSL Encrypted</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Secure Payment</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Form Section */}
            <div className="bg-white p-8 lg:p-10">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">
                Payment Details
              </h2>
              
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-gray-600">Loading secure payment form...</p>
                </div>
              ) : clientSecret ? (
                <Elements options={options} stripe={stripePromise}>
                  <CheckoutForm total={total} />
                </Elements>
              ) : (
                <div className="text-center py-12">
                  <p className="text-red-600">Unable to load payment form. Please try again.</p>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Footer Note */}
        <p className="text-center text-sm text-gray-600 mt-6">
          By completing your purchase, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default CheckoutPageClient;