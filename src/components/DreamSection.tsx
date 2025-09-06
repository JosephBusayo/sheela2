import React from 'react'
import { Button } from './ui/button'
import Link from 'next/link'

const DreamSection = () => {
  return (
    <section
      className='w-full h-[400px] bg-cover bg-center my-4 flex flex-col justify-center items-center'
      style={{
        backgroundImage: `url('/dream.png')`,
      }}
    >
      <div className='absolute sm:w-[600px] md:w-[650px] md:ml-12 lg:w-[800px] h-[400px] bg-[#EEEEEE] opacity-100'>

      </div>
      <div className='sm:max-w-2xl flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 bg-[#EEEEEE] py-12'>
        <div className="relative z-10 flex w-full flex-[0_0_auto] flex-col items-center gap-6 self-stretch">
          <div className="relative flex w-full flex-[0_0_auto] flex-col items-center gap-4 self-stretch">
            <h2 className="relative mt-[-1.00px] self-stretch text-center text-3xl sm:text-3xl md:text-4xl font-normal leading-[50.4px] tracking-[0] text-black">
              DREAM IT AND WE MAKE IT
            </h2>
            <p className="relative w-full max-w-[510px] px-4 text-center text-base leading-[22.4px] tracking-[0] text-[#000000b2]">
              Bring Your Unique Style To Life With Custom Designs Tailored Just
              For You.
            </p>
          </div>
          <Link href={"/contact-us"}>
            <Button className="h-[40px] sm:h-[50px] md:h-[60px] bg-bt-green px-4 sm:px-6 py-2 border-0 rounded-none text-white cursor-pointer">
            <span className="text-sm sm:text-base font-medium leading-[22.4px] tracking-[0]">
              DESIGN WITH SHEELA
            </span>
            </Button>
          </Link>
        </div>
      </div>

    </section>
  )
}

export default DreamSection
