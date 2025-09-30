import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// DELETE /api/products/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
  }

  try {
    await prisma.product.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Product deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const  { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
  }

  try {
    const body = await req.json();
    const { name, description, price, categoryId, subCategoryId, images, sizes, colors, fabricSamples } = body;

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price,
        categoryId,
        subCategoryId,
        images: {
          deleteMany: {},
          create: images.map((image: any) => ({
            url: image.url,
            alt: image.alt,
            order: image.order,
          })),
        },
        sizes: {
          deleteMany: {},
          create: sizes.map((size: any) => ({
            size: size.size,
          })),
        },
        colors: {
          deleteMany: {},
          create: colors.map((color: any) => ({
            color: color.color,
          })),
        },
        fabricSamples: {
          set: fabricSamples.map((sample: any) => ({ id: sample.id })),
        },
      },
      include: {
        images: true,
        sizes: true,
        colors: true,
        category: true,
        subCategory: true,
        fabricSamples: true,
      },
    });

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    console.error("Failed to update product:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}
