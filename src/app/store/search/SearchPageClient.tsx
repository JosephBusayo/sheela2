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
    sales: 0, // Add the missing 'sales' property with a default value
  }));

  return (
    <div className="w-full mx-auto px-4 py-8">
      <h1 className="text-2xl font-normal tracking-widest mb-4 text-center my-4 lg:my-6">
        Search Results for "{query}"
      </h1>
      {transformedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {transformedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-center text-2xl md:text-4xl text-normal tracking-widest">No products found for your search.</p>
      )}
    </div>
  );
};

export default SearchPageClient;
