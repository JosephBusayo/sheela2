import React from 'react'
import Header from '../../components/Header'
import HeroSection from '../../components/HeroSection'
import FeatureCard from '@/components/FeatureCard'
import DreamSection from '@/components/DreamSection'
import AdBanner from '@/components/AdBanner'
import ProductGrid from '@/components/ProductGrid'

import ProductCard from '@/components/ProductCard'
import { sampleProducts } from '@/lib/utils'
import Footer from '@/components/Footer'

const Home = () => {
  return (
    <div className='flex flex-col items-center justify-center overflow-clip' suppressHydrationWarning={true}>
      <Header/>
      <HeroSection/>
      <FeatureCard/>
      <ProductGrid products={sampleProducts} className='md:pr-8 lg:pr-0'/>
      <DreamSection/>
      <ProductGrid products={sampleProducts} className='md:pr-8 lg:pr-0'/>
      <AdBanner/>
      <Footer/>


      
    </div>
  )
}

export default Home