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
        fabricSamples: true,
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

export async function POST(request: Request) {
  try {
    const body: ProductWithRelations = await request.json();
    const {
      name,
      description,
      price,
      categoryId,
      subCategoryId,
      images,
      sizes,
      colors,
      fabricSamples,
    } = body;

    if (!name || !price || !categoryId) {
      return NextResponse.json(
        { error: "Missing required fields: name, price, categoryId" },
        { status: 400 }
      );
    }

    const productData: any = {
      name,
      description,
      price,
      category: { connect: { id: categoryId } },
      images: {
        create: images.map((image) => ({
          url: image.url,
          alt: image.alt,
          order: image.order,
        })),
      },
      sizes: {
        create: sizes.map((size) => ({ size: size.size })),
      },
      colors: {
        create: colors.map((color) => ({ color: color.color })),
      },
    };

    if (subCategoryId) {
      productData.subCategory = { connect: { id: subCategoryId } };
    }

    if (fabricSamples && fabricSamples.length > 0) {
      productData.fabricSamples = {
        connect: fabricSamples.map((sample) => ({ id: sample.id })),
      };
    }

    const newProduct = await prisma.product.create({
      data: productData,
      include: {
        images: true,
        sizes: true,
        colors: true,
        category: true,
        subCategory: true,
        fabricSamples: true,
      },
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { error: "Internal Server Error", details: errorMessage },
      { status: 500 }
    );
  }
}
