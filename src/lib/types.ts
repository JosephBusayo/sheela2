import { Product, ProductImage as PrismaProductImage, ProductSize as PrismaProductSize, ProductColor as PrismaProductColor } from '@prisma/client';

export type ProductWithRelations = Product & {
  images: PrismaProductImage[];
  sizes: PrismaProductSize[];
  colors: PrismaProductColor[];
};
