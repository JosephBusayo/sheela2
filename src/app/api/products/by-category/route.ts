import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    if (!category) {
      return new NextResponse("Category is required", { status: 400 });
    }

    const productsFromDb = await prisma.product.findMany({
      where: {
        category: {
          name: {
            equals: category,
            mode: "insensitive",
          },
        },
      },
      include: {
        images: true,
        category: true,
      },
    });

    const totalProducts = await prisma.product.count();

    return NextResponse.json({ products: productsFromDb, totalProducts });
  } catch (error) {
    console.error("[PRODUCTS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
