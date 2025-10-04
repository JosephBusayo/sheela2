import Header from "@/components/Header";
import CartPageClient from "./CartPageClient";
import SimilarProducts from "@/components/SimilarProducts";
import { getProducts } from "./actions";
import Footer from "@/components/Footer";
import ProductGrid from "@/components/ProductGrid";


export default async function CartPage() {
 const productsRaw = await getProducts();
   // Add 'sales' property to each product
   const products = productsRaw.map(product => ({
    ...product,
    images: product.images.map(image => image.url),
    sales: 0, // Default to 0
    price: product.price.toString(),
    category: {
      name: product.category.name as 'women' | 'men' | 'kids' | 'unisex' | 'fabrics'
    },
    // Ensure sizes and colors are passed
    sizes: product.sizes.map(size => size.size),
    colors: product.colors.map(color => color.color),
  }));
  return (
    <div suppressHydrationWarning={true} className="flex flex-col overflow-x-hidden justify-center items-center px-0">
      <Header />
      <CartPageClient />
      <div className="my-8">
        <h1 className="text-xl md:text-3xl font-normal text-center uppercase">
        You Might Also Like
      </h1>
      </div>
      <ProductGrid products={products}/>
      <Footer/>
    </div>
  );
}
