import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FavouritesPageClient from "./WishlistPageClient";
import SimilarProducts from "@/components/SimilarProducts";
import { getProducts } from "./actions";

export default async function WishlistPage() {
  const products = await getProducts();
  return (
    <div
      className="flex flex-col overflow-x-hidden justify-center items-center px-0"
      suppressHydrationWarning={true}
    >
      <Header />
      <FavouritesPageClient />
      <SimilarProducts products={products} />
      <Footer />
    </div>
  );
}
