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
      icon: "/j-right.svg",
      title: "PICK A STYLE",
      subtitle: "Choose Your Preferred Style",
      description: "Browse through our extensive collection of authentic African designs and contemporary styles."
    },
    {
        id: 2,
      icon: "/ruler.svg",
      title: "ADD YOUR MEASUREMENT",
      subtitle: "Add Your Correct Measurement",
      description: "Provide your accurate measurements to ensure a perfect fit for your custom garment."
    },
    {
        id: 3,
      icon: "/whatsapp.svg",
      title: "CHAT WITH SHEELA",
      subtitle: "Chat With Sheela To Confirm Your Order",
      description: "Connect with our team to finalize details and confirm your personalized order."
    },
    {
        id: 4,
      icon: "/dollar-circle.svg",
      title: "MAKE YOUR PAYMENT",
      subtitle: "Make Your Payment To Kickstart Your Order",
      description: "Complete your purchase securely and start the creation of your unique piece."
    }
  ];



const FeatureCard = () => {

  return (
    <div className='w-[100%] h-[100%] px-4 my-9 mx-4 sm:px-6 lg:px-8 m'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
        {featureCards.map((card, index) => (
            <div className='bg-[#EEEEEE] p-6 text-center shadow-sm ' key={index}>
                <div className='flex justify-center mb-4'>
                    <div className='p-4 rounded-full'>
                        <Image src={card.icon} alt={card.title} width={40} height={40} />
                    </div>
                </div>
                <h3 className='text-lg font-semibold mb-2'>{card.title}</h3>
                <p className='text-sm text-gray-500 leading-relaxed'>
                    {card.subtitle}
                </p>
            </div>
        ))}
        </div>
    </div>
  )
}

export default FeatureCard