import React from 'react'
import Header from '../../components/Header'
import HeroSection from '../../components/HeroSection'
import FeatureCard from '@/components/FeatureCard'
import DreamSection from '@/components/DreamSection'
import AdBanner from '@/components/AdBanner'
import ProductGrid from '@/components/ProductGrid';
import { sampleProducts } from '@/lib/utils'
import Footer from '@/components/Footer'
import StyleGrid from '@/components/StyleGrid';

const Home = () => {
  return (
    <div className='flex flex-col items-center justify-center overflow-clip' suppressHydrationWarning={true}>
      <HeroSection/>
     
      <ProductGrid products={sampleProducts} title="New Arrivals" />
       <StyleGrid />
      <FeatureCard/>
      <ProductGrid products={sampleProducts} title="Best Sellers" />
     
      <Footer/>


      
    </div>
  )
}

export default Home
