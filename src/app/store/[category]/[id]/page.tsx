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
  const productData = await getProductbyId(id);

  if (!productData) {
    redirect(`/store/${category}`);
  }

  const similarProductsData = await getSimilarProducts(
    productData.categoryId,
    productData.id
  );

  // Data for ProductPageClient (needs object arrays for images, etc.)
  const productForClient = {
    ...productData,
    price: String(productData.price),
    sales: 0, // Add sales property
    category: {
      ...productData.category,
      name: productData.category.name as "women" | "men" | "kids" | "unisex" | "fabrics",
    },
  };

  const similarProductsForClient = similarProductsData.map((p) => ({
    ...p,
    price: String(p.price),
    sales: 0, // Add sales property
    category: {
      ...p.category,
      name: p.category.name as "women" | "men" | "kids" | "unisex" | "fabrics",
    },
  }));

  // Data for SimilarProducts grid (needs string arrays for images, etc.)
  const similarProductsForGrid = similarProductsData.map((p) => ({
    ...p,
    price: String(p.price),
    images: p.images.map((img) => img.url),
    colors: p.colors.map((c) => c.color),
    sizes: p.sizes.map((s) => s.size),
    category: {
      name: p.category.name as "women" | "men" | "kids" | "unisex" | "fabrics",
    },
    description: p.description === null ? undefined : p.description,
    sales: 0,
  }));

  return (
    <div className="flex flex-col" suppressHydrationWarning={true}>
      <Header />
      <ProductPageClient
        product={productForClient}
        similarProducts={similarProductsForClient}
      />
      <SimilarProducts products={similarProductsForGrid} />
      <Footer />
    </div>
  );
};

export default ProductInfoPage;
