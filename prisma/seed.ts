import { sampleProducts } from "../src/lib/utils";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clear old data (optional during development)
  await prisma.productColor.deleteMany();
  await prisma.productSize.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();

  // Seed Products
  for (const product of sampleProducts) {
    const createdProduct = await prisma.product.create({
      data: {
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        category: product.category.toUpperCase(),
        description: product.description,
      },
    });

    // Create images
    await prisma.productImage.createMany({
      data: product.images.map((img, index) => ({
        url: img,
        alt: `${product.name} image ${index + 1}`,
        order: index,
        productId: createdProduct.id,
      })),
    });

    // Create sizes
    if (product.sizes) {
      await prisma.productSize.createMany({
        data: product.sizes.map((size) => ({
          size,
          productId: createdProduct.id,
        })),
      });
    }

    // Create colors
    if (product.colors) {
      await prisma.productColor.createMany({
        data: product.colors.map((color) => ({
          color,
          productId: createdProduct.id,
        })),
      });
    }
  }

  console.log("✅ Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
