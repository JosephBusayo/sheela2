import Header from "@/components/Header";
import CartPageClient from "./CartPageClient";
import SimilarProducts from "@/components/SimilarProducts";
import { getProducts } from "./actions";
import Footer from "@/components/Footer";


export default async function CartPage() {
  const productsData = await getProducts();
  const products = productsData.map((p) => ({
    ...p,
    images: p.images.map((img) => img.url),
    category: {
      name: p.category.name as "women" | "men" | "kids" | "unisex" | "fabrics",
    },
    description: p.description === null ? undefined : p.description,
  }));
  return (
    <div suppressHydrationWarning={true} className="flex flex-col overflow-x-hidden justify-center items-center px-0">
      <Header />
      <CartPageClient />
      <SimilarProducts products={products} />
      <Footer/>
    </div>
  );
}
