import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FavouritesPageClient from "./WishlistPageClient";
import SimilarProducts from "@/components/SimilarProducts";
import { getProducts } from "./actions";
import ProductGrid from "@/components/ProductGrid";

export default async function WishlistPage() {
  const productsRaw = await getProducts();
  // Add 'sales' property to each product
  const products = productsRaw.map(product => ({
    ...product,
    sales: 0 // Default to 0
  }));
  return (
    <div
      className="flex flex-col overflow-x-hidden justify-center items-center px-0"
      suppressHydrationWarning={true}
    >
      <Header />
      <FavouritesPageClient />
      <div className="my-8">
        <h1 className="text-xl md:text-3xl font-normal text-center uppercase">
        You Might Also Like
      </h1>
      </div>
      <ProductGrid products={products}/>
      <Footer />
    </div>
  );
}
