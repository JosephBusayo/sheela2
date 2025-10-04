import { NextResponse } from "next/server";
import { OrderService } from "@/lib/order-services";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Optional: Add role-based access control here if needed

    const orders = await OrderService.getAllOrders();

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Get all orders error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
