import React from "react";
import { getProductbyId, getSimilarProducts } from "./actions";
import { redirect } from "next/navigation";
import ProductPageClient from "./ProductPageClient";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SimilarProducts from "@/components/SimilarProducts";

type RouteParams = {
  params: {
    category: string;
    id: string;
  };
};

const ProductInfoPage = async ({ params }: RouteParams) => {
  const { category, id } = await params;
  const product = await getProductbyId(id);

  if (!product) {
    redirect(`/store/${category}`);
  }

  const similarProductsData = await getSimilarProducts(
    product.categoryId,
    product.id
  );

  const similarProducts = similarProductsData.map((p) => ({
    ...p,
    images: p.images.map((img) => img.url),
    category: {
      name: p.category.name as "women" | "men" | "kids" | "unisex" | "fabrics",
    },
    originalPrice: p.originalPrice === null ? undefined : p.originalPrice,
    description: p.description === null ? undefined : p.description,
  }));

  return (
    <div className="flex flex-col" suppressHydrationWarning={true}>
      <Header />
      <ProductPageClient
        product={product}
        similarProducts={similarProductsData}
      />
      <SimilarProducts products={similarProducts} />
      <Footer />
    </div>
  );
};

export default ProductInfoPage;
