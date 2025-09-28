import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ProductWithRelations } from "@/lib/types";

export async function GET() {
  try {
    const products: ProductWithRelations[] = await prisma.product.findMany({
      include: {
        images: true,
        sizes: true,
        colors: true,
        category: true,
        subCategory: true,
      },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
