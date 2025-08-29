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
    <div className='flex flex-col items-center justify-center overflow-clip'>
      <Header/>
      <HeroSection/>
      <FeatureCard/>
      <ProductGrid products={sampleProducts}/>
      <DreamSection/>
      <ProductGrid products={sampleProducts}/>
      <AdBanner/>
      <Footer/>


      
    </div>
  )
}

export default Home