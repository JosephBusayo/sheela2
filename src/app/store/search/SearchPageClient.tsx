"use client";

import React from "react";
import ProductCard from "@/components/ProductCard";
import { Product } from "../../../../stores/useStore";
import { Category, Product as PrismaProduct, ProductImage } from "@prisma/client";

type ProductWithRelations = PrismaProduct & {
  images: ProductImage[];
  category: Category;
};

interface SearchPageClientProps {
  products: ProductWithRelations[];
  query: string;
}

const SearchPageClient: React.FC<SearchPageClientProps> = ({
  products,
  query,
}) => {
  const transformedProducts: Product[] = products.map((product) => ({
    ...product,
    images: product.images.map((image) => image.url),
    category: {
      name: product.category.name as
        | "women"
        | "men"
        | "kids"
        | "unisex"
        | "fabrics",
    },
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">
        Search Results for "{query}"
      </h1>
      {transformedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {transformedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p>No products found for your search.</p>
      )}
    </div>
  );
};

export default SearchPageClient;
