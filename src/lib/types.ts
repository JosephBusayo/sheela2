import { Product, ProductImage as PrismaProductImage, ProductSize as PrismaProductSize, ProductColor as PrismaProductColor, FabricSample as PrismaFabricSample } from '@prisma/client';

export type FabricSample = PrismaFabricSample;

export type ProductWithRelations = Product & {
  images: PrismaProductImage[];
  sizes: PrismaProductSize[];
  colors: PrismaProductColor[];
  fabricSamples: FabricSample[];
};
