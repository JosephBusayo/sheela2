import React from "react";
import ProductGrid from "./ProductGrid";
import { Product } from "@prisma/client";

type SimilarProductsProps = {
  products: (Omit<Product, "originalPrice" | "description"> & {
    images: string[];
    category: {
      name: "women" | "men" | "kids" | "unisex" | "fabrics";
    };
    originalPrice?: number;
    description?: string;
  })[];
};

const SimilarProducts = ({ products }: SimilarProductsProps) => {
  return (
    <div className="my-10">
      <h1 className="text-3xl font-normal text-center uppercase">
        You Might Also Like
      </h1>
      <div className="mt-6 px-4 lg:px-0">
        <ProductGrid products={products} className="" />
      </div>
    </div>
  );
};

export default SimilarProducts;
