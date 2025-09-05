import { sampleProducts } from "../src/lib/utils";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clear old data
  console.log("Clearing old data...");
  await prisma.productColor.deleteMany();
  await prisma.productSize.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.subCategory.deleteMany();
  await prisma.category.deleteMany();
  console.log("Old data cleared.");

  // Seed Categories and Subcategories
  console.log("Seeding categories and subcategories...");
  const categories = [...new Set(sampleProducts.map(p => p.category.name))];
  for (const categoryName of categories) {
    await prisma.category.create({
      data: {
        name: categoryName,
      },
    });
  }

  const subCategories = [...new Set(sampleProducts.filter(p => p.subCategory).map(p => ({ category: p.category.name, subCategory: p.subCategory })))];
  for (const item of subCategories) {
    const category = await prisma.category.findUnique({ where: { name: item.category } });
    if (category) {
      await prisma.subCategory.create({
        data: {
          name: item.subCategory!,
          categoryId: category.id,
        },
      });
    }
  }
  console.log("Categories and subcategories seeded.");

  // Seed Products
  console.log("Seeding products...");
  for (const product of sampleProducts) {
    const category = await prisma.category.findUnique({
      where: { name: product.category.name },
    });

    if (!category) {
      console.warn(`Category "${product.category.name}" not found for product "${product.name}". Skipping product.`);
      continue;
    }

    let subCategory = null;
    if (product.subCategory) {
      subCategory = await prisma.subCategory.findFirst({
        where: {
          name: product.subCategory,
          categoryId: category.id,
        },
      });
    }

    const createdProduct = await prisma.product.create({
      data: {
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        description: product.description,
        categoryId: category.id,
        subCategoryId: subCategory ? subCategory.id : null,
      },
    });

    // Create images
    if (product.images && product.images.length > 0) {
      await prisma.productImage.createMany({
        data: product.images.map((img, index) => ({
          url: img,
          alt: `${product.name} image ${index + 1}`,
          order: index,
          productId: createdProduct.id,
        })),
      });
    }

    // Create sizes
    if (product.sizes && product.sizes.length > 0) {
      await prisma.productSize.createMany({
        data: product.sizes.map((size) => ({
          size,
          productId: createdProduct.id,
        })),
      });
    }

    // Create colors
    if (product.colors && product.colors.length > 0) {
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
