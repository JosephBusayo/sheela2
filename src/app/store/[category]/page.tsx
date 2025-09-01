
import Header from "@/components/Header";
import ProductGrid from "@/components/ProductGrid";
import { sampleProducts } from "@/lib/utils";

export default async function  CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const { category } = params;
  const filteredProducts = sampleProducts.filter(
    (product) => product.category.toLowerCase() === category
  );

  return (
    <div className="">
      <Header/>
      <h1 className="text-3xl font-bold capitalize mb-4">{category}</h1>
      <ProductGrid products={filteredProducts} />
    </div>
  );
}
