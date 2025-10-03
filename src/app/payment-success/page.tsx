import React, { Suspense } from "react";
import PaymentSuccessClient from "@/components/PaymentSuccessClient";

const Loader = () => (
  <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
    <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<Loader />}>
      <PaymentSuccessClient />
    </Suspense>
  );
}
