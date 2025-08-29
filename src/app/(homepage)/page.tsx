import React from 'react'
import Header from '../../components/Header'
import HeroSection from '../../components/HeroSection'
import FeatureCard from '@/components/FeatureCard'
import DreamSection from '@/components/DreamSection'
import AdBanner from '@/components/AdBanner'

const Home = () => {
  return (
    <div className='flex flex-col items-center justify-center'>
      <Header/>
      <HeroSection/>
      <FeatureCard/>
      <DreamSection/>
      <AdBanner/>

      
    </div>
  )
}

export default Home