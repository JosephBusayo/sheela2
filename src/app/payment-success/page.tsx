"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Package, Mail, ArrowRight, Download, Home } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";

const PaymentSuccessPage = () => {
  const searchParams = useSearchParams();
  const [paymentIntent, setPaymentIntent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const payment_intent = searchParams.get("payment_intent");
    if (payment_intent) {
      setPaymentIntent(payment_intent);
    }
    setIsLoading(false);
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6 animate-bounce">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Payment Successful!
          </h1>
          <p className="text-lg text-gray-600">
            Thank you for your purchase. Your order has been confirmed.
          </p>
        </div>

        {/* Order Confirmation Card */}
        <Card className="p-8 mb-6 shadow-xl border-0">
          <div className="space-y-6">
            {/* Order Number */}
            {paymentIntent && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Order Number</p>
                <p className="font-mono text-sm md:text-base font-semibold text-gray-900 break-all">
                  {paymentIntent}
                </p>
              </div>
            )}

            {/* What's Next Section */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                What happens next?
              </h2>
              <div className="space-y-4">
                {/* Step 1 */}
                {/* <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Mail className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Confirmation Email
                    </h3>
                    <p className="text-gray-600 text-sm">
                      You'll receive an order confirmation email with your receipt and order details shortly.
                    </p>
                  </div>
                </div> */}

                {/* Step 2 */}
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Package className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Order Processing
                    </h3>
                    <p className="text-gray-600 text-sm">
                      We're preparing your items for shipment. You'll get a tracking number once your order ships.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <Download className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Track Your Order
                    </h3>
                    <p className="text-gray-600 text-sm">
                      You can track your order status
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Estimated Delivery */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-100">
              <div className="flex items-center gap-3 mb-2">
                <Package className="w-6 h-6 text-blue-600" />
                <h3 className="font-semibold text-gray-900">
                  Estimated Delivery
                </h3>
              </div>
              <p className="text-gray-700">
                Your order will arrive within <span className="font-semibold">10-14 days</span>
              </p>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 gap-4 mb-8">
          <Link href="/">
            <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center cursor-pointer gap-2">
              <Home className="w-5 h-5" />
              <span>Continue Shopping</span>
            </button>
          </Link>
          {/* <Link href="/orders">
            <button className="w-full bg-white hover:bg-gray-50 text-gray-900 font-semibold py-4 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 border border-gray-200">
              <span>View Order Details</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </Link> */}
        </div>

        {/* Support Section */}
        <Card className="p-6 bg-gray-50 border-0">
          <div className="text-center">
            <h3 className="font-semibold text-gray-900 mb-2">
              Need Help?
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              If you have any questions about your order, our support team is here to help.
            </p>
            <Link href="/contact">
              <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
                Contact Support →
              </button>
            </Link>
          </div>
        </Card>

        {/* Footer Note */}
        {/* <p className="text-center text-sm text-gray-500 mt-8">
          A copy of your receipt has been sent to your email address.
        </p> */}
      </div>
    </div>
  );
};

export default PaymentSuccessPage;