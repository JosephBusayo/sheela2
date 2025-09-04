"use server";
import prisma from "@/lib/prisma";

export const getProducts = async () => {
  const products = await prisma.product.findMany({
    take: 4,
    include: {
      images: true,
      category: true,
    },
  });
  return products;
};
