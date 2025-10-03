import React from "react";
import ProductGrid from "./ProductGrid";
import { Product } from "../../stores/useStore";

type SimilarProductsProps = {
  products: Product[];
};

const SimilarProducts = ({ products }: SimilarProductsProps) => {
  return (
    <div className="my-10 md:pr-5 lg:pr-0">
      <h1 className="text-3xl font-normal text-center uppercase">
        You Might Also Like
      </h1>
      <div className="mt-6 px-4 lg:px-0">
        <ProductGrid products={products}  />
      </div>
    </div>
  );
};

export default SimilarProducts;
