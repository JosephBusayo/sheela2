import React from 'react'
import { getProductbyId, getSimilarProducts } from './actions';
import { redirect } from 'next/navigation';
import ProductPageClient from './ProductPageClient';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductGrid from '@/components/ProductGrid';

type RouteParams = {
  params: {
    category: string;
    id: string;
  }
}

const ProductInfoPage = async ({params}: RouteParams) => {
  const {category, id} = await params;
  const product = await getProductbyId(id);
  
  if(!product) {
    redirect(`/store/${category}`);
  }

  const similarProductsData = await getSimilarProducts(product.categoryId, product.id);

  const similarProducts = similarProductsData.map(p => ({
    ...p,
    images: p.images.map(img => img.url),
    category: {
      name: p.category.name as 'women' | 'men' | 'kids' | 'unisex' | 'fabrics',
    },
    originalPrice: p.originalPrice === null ? undefined : p.originalPrice,
    description: p.description === null ? undefined : p.description,
  }));

  return (
  <div className='flex flex-col' suppressHydrationWarning={true}>
    <Header/>
<ProductPageClient product={product} similarProducts={similarProductsData} />
<div className='my-10'>
  <h1 className='text-3xl font-normal text-center uppercase'>You Might Also Like</h1>
  <div className='mt-6 px-4 lg:px-0'>
    <ProductGrid products={similarProducts} className=''/>
  </div>
  
</div>
<Footer/>

  </div>
  )}

export default ProductInfoPage
