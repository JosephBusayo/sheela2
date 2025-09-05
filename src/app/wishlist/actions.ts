"use server";

import prisma from "@/lib/prisma";

export async function getProducts() {
  const products = await prisma.product.findMany({
    take: 4,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      category: true,
      images: true,
    },
  });

  return products.map((product) => ({
    ...product,
    originalPrice: product.originalPrice === null ? undefined : product.originalPrice,
    description: product.description === null ? undefined : product.description,
    images: product.images.map((image) => image.url),
    category: {
      ...product.category,
      name: product.category.name as "women" | "men" | "kids" | "unisex" | "fabrics",
    },
  }));
}
