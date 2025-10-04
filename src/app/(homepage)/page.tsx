import React from 'react'
import Header from '../../components/Header'
import HeroSection from '../../components/HeroSection'
import FeatureCard from '@/components/FeatureCard'
import DreamSection from '@/components/DreamSection'
import AdBanner from '@/components/AdBanner'
import ProductGrid from '@/components/ProductGrid';
import Footer from '@/components/Footer'
import StyleGrid from '@/components/StyleGrid';
import { Product } from '../../../stores/useStore';
import prisma from '@/lib/prisma';

const getProducts = async (): Promise<Product[]> => {
  try {
    const products = await prisma.product.findMany({
      include: {
        images: { orderBy: { order: 'asc' } },
        sizes: true,
        colors: true,
        category: true,
        subCategory: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transform the data to match the Product interface from the store
    return products.map(product => ({
      ...product,
      price: product.price, // Price is a string from the DB
      sales: 0, // Add the missing sales property with a default value
      images: product.images.map(img => img.url),
      category: {
        name: product.category.name as any, // Cast to match the specific string literals
      },
      subCategory: product.subCategory?.name,
      sizes: product.sizes.map(s => s.size),
      colors: product.colors.map(c => c.color),
    }));
  } catch (error) {
    console.error('Error fetching products directly:', error);
    return [];
  }
};

const Home = async () => {
  const products: Product[] = await getProducts();
  const newArrivals = products.slice(0, 8); // Already sorted by createdAt in the query
  const bestSellers = [...products].sort((a, b) => b.sales - a.sales).slice(0, 8);
  return (
    <div className='flex flex-col items-center justify-center overflow-clip' suppressHydrationWarning={true}>
      <HeroSection/>
     
      <ProductGrid products={newArrivals} title="New Arrivals" />
       <StyleGrid />
      <FeatureCard/>
      <ProductGrid products={bestSellers} title="Best Sellers" />
     
      <Footer/>


      
    </div>
  )
}

export default Home
