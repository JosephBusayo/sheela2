import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";


export async function getProductbyId(id: string) {
  const product = await prisma.product.findUnique({
    where: {
      id
    },
    include: {
      images: true,
      sizes: true
    }
  });
  if(!product) throw new Error('Product not found');
  return product;
}

export async function getSimilarProducts(categoryId: string, currentProductId: string) {
  const products = await prisma.product.findMany({
    where: {
      categoryId,
      id: {
        not: currentProductId,
      },
    },
    include: {
      images: true,
      category: true,
    },
    take: 4,
  });
  return products;
}
