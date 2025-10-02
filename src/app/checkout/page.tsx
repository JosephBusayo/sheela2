import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import CheckoutPageClient from "./CheckoutPageClient";
import Header from "@/components/Header";


const CheckoutPage = async () => {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return(
    <div className="flex flex-col bg-gray-100 min-h-screen">
        <Header/>
        <CheckoutPageClient />
    </div>
    
  ) ;
};

export default CheckoutPage;
