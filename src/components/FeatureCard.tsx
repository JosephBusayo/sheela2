import Image from 'next/image';
import React from 'react'


  interface FeatureCardProps {
    id: number; 
    title: string;
    subtitle: string;
    description: string;
    icon: string;
  }

const featureCards: FeatureCardProps[] = [
    {
        id: 1,
      icon: "/images/needle.svg",
      title: "Custom-made Embroidery",
      subtitle: "Choose Your Preferred Style",
      description: "Each design is custom-embroidered by Sheela, inspired by heritage, made for modern elegance."
    },
    {
        id: 2,
      icon: "/images/ShieldCheck.svg",
      title: "Premium Quality Fabrics",
      subtitle: "Add Your Correct Measurement",
      description: "We carefully source breathable, durable fabrics that feel as good as they look."
    },
    {
        id: 3,
      icon: "/images/TruckTrailer.svg",
      title: "Worldwide Shipping",
      subtitle: "Chat With Sheela To Confirm Your Order",
      description: "From Africa to your doorstep, wherever you are, we deliver authentic African wear with care."
    },
    
  ];



const FeatureCard = () => {

  return (
    <div className='w-[100%] h-[100%] px-4 my-9 mx-6 sm:px-6 lg:px-24'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-12 lg:gap-16'>
        {featureCards.map((card, index) => (
            <div className='p-6 white text-center' key={index}>
                <div className='flex justify-center mb-4'>
                    <div className='p-4 rounded-full'>
                        <Image src={card.icon} alt={card.title} width={40} height={40} className='w-6 h-6 md:w-12 md:h-12' />
                    </div>
                </div>
                <h3 className='text-sm md:text-lg font-normal mb-2 uppercase tracking-tight '>{card.title}</h3>
                <p className='text-xs md:text-lg text-gray-500 leading-relaxed uppercase tracking-tight font-light'>
                    {card.description}
                </p>
            </div>
        ))}
        </div>
    </div>
  )
}

export default FeatureCard