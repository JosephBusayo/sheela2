"use client";

import React from "react";
import ProductCard from "@/components/ProductCard";
import { Product } from "../../stores/useStore";

interface ProductGridProps {
  products: Product[];
  title?: string;
  className?: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, title, className }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      {products.slice(0, 4).map((product) => (
        <div key={product.id} className="w-[90vw] md:w-auto mx-auto">
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
