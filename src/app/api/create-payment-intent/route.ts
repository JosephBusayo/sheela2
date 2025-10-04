import { NextResponse } from "next/server";
import Stripe from "stripe";
import { CartItem } from "../../../../stores/useStore";
import { getOrCreateUser } from "@/lib/getOrCreateUser";
import prisma from "@/lib/prisma";

// Validate environment variable
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set in environment variables");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-09-30.clover",
  typescript: true,
});

const calculateOrderAmount = (items: CartItem[]) => {
  const total = items.reduce((acc, item) => {
    return acc + parseFloat(item.price) * item.quantity;
  }, 0);
  return Math.round(total * 100); // Stripe amount in cents
};

export async function POST(req: Request) {
  try {
    const { items } = await req.json();

    // Validate items
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "No items in the cart" },
        { status: 400 }
      );
    }

    // Calculate amount
    const amount = calculateOrderAmount(items);

    // Validate amount
    if (amount < 50) { // Stripe minimum is $0.50
      return NextResponse.json(
        { error: "Order amount is too low. Minimum is $0.50" },
        { status: 400 }
      );
    }

    console.log("Creating payment intent for amount:", amount);

    // Create PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        orderItems: JSON.stringify(items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price
        }))),
      },
    });

    console.log("Payment intent created:", paymentIntent.id);

    // Get user and create order
    try {
      const user = await getOrCreateUser();
      const order = await prisma.order.create({
        data: {
          orderNumber: paymentIntent.id,
          total: amount / 100,
          subtotal: amount / 100,
          userId: user.id,
          items: {
            create: items.map((item: any) => ({
              productId: item.id,
              quantity: item.quantity,
              price: parseFloat(item.price),
              selectedSize: item.selectedSize,
              selectedColor: item.selectedColor,
              selectedLength: item.selectedLength,
            })),
          },
        },
      });
      console.log("Order created:", order.id);
    } catch (error) {
      console.error("Failed to get user or create order:", error);
      // Even if order creation fails, don't block the payment process
    }

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
    
  } catch (error: any) {
    console.error("Error creating payment intent:", error);
    
    return NextResponse.json(
      { 
        error: "Failed to create payment intent",
        message: error?.message || "Unknown error"
      },
      { status: 500 }
    );
  }
}
