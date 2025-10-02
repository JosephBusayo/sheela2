import { NextResponse } from "next/server";
import Stripe from "stripe";
import { CartItem } from "../../../../stores/useStore";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-09-30.clover",
});

const calculateOrderAmount = (items: CartItem[]) => {
  const total = items.reduce((acc, item) => {
    return acc + parseFloat(item.price) * item.quantity;
  }, 0);
  return Math.round(total * 100); // Stripe amnt in cents
};

export async function POST(req: Request) {
  const { items } = await req.json();

  if (!items || items.length === 0) {
    return NextResponse.json(
      { error: "No items in the cart" },
      { status: 400 }
    );
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: calculateOrderAmount(items),
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return NextResponse.json(
      { error: "Failed to create payment intent" },
      { status: 500 }
    );
  }
}
