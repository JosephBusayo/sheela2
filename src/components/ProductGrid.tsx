"use client";

import React from "react";
import ProductCard from "@/components/ProductCard";
import { Product } from "../../stores/useStore";

interface ProductGridProps {
  products: Product[];
  title?: string;
  className?: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
