import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
 
  context: { params: Promise<{ category: string }> }
) {
  try {
    const { category } = await context.params;

    if (!category) {
      return new NextResponse("Category is required", { status: 400 });
    }

    const subCategoriesFromDb = await prisma.subCategory.findMany({
      where: {
        category: {
          name: {
            equals: category,
            mode: "insensitive",
          },
        },
      },
    });

    return NextResponse.json({ subCategories: subCategoriesFromDb });
  } catch (error) {
    console.error("[SUBCATEGORIES_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
