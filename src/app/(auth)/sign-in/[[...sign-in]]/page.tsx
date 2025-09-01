"use client"
import { SignIn, useClerk } from '@clerk/nextjs';
import { Loader } from '@/components/ui/loader';

export default function Page() {
  const { loaded } = useClerk();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md flex flex-col items-center">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Sign In to Sheela</h1>
          <p className="text-gray-600 mt-2">Welcome to our store! Please sign in to continue</p>
        </div>
        {loaded ? (
          <SignIn 
            appearance={{
              elements: {
                formButtonPrimary: 
                  "bg-[#4A5D4A] hover:bg-[#3d4d3d] text-sm normal-case",
                card: "shadow-lg",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
              
              }
            }}
          />
        ) : (
          <Loader />
        )}
      </div>
    </div>
  );
}
