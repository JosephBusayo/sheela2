"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Button } from "@/components/ui/button";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function Hero() {
  const backgroundImages = [
    {
      left: "/images/model1.png",
      right: "/images/model5.jpg",
    },
    {
      left: "/images/model5.jpg",
      right: "/images/model1.png",
    },
  ];

  return (
    <section className="relative w-full h-[50vh] md:h-[70vh] lg:h-[80vh] overflow-hidden flex items-center justify-center mb-2">
      {/* Swiper Carousel */}
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 12000, disableOnInteraction: false }}
        loop={true}
        className="w-full h-full"
      >
        {backgroundImages.map((img, index) => (
          <SwiperSlide key={index}>
            <div className="flex w-full h-full bg-gray-400">
              {/* Left Image */}
              <div className="relative w-1/2 h-full">
                <Image
                  src={img.left}
                  alt={`Hero background left ${index + 1}`}
                  fill
                  className="object-cover object-center md:object-top"
                 
                />
              </div>

              {/* Right Image */}
              <div className="relative w-1/2 h-full">
                <Image
                  src={img.right}
                  alt={`Hero background right ${index + 1}`}
                  fill
                  className="object-cover object-center md:object-top"
                 
                />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Overlay Text + Button */}
      <div
        className="
          absolute inset-0 flex flex-col items-center justify-center text-center z-50
          w-[90vw] max-w-4xl
          left-1/2 -translate-x-1/2
          px-4 sm:px-8
        "
      >
        <h1
          className="relative text-white text-center text-[36px] font-normal leading-[140%] self-stretch"
        >
          STANDOUT FROM THE CROWD WITH WEARS AND STYLES FROM SHEELA
        </h1>
        <Button className="h-[50px] w-[220px] bg-bt-green hover:bg-bt-green/90 px-6 py-2.5 translate-y-[-1rem] mt-6 cursor-pointer border-0 rounded-none shadow-sm">
         <span className="font-medium text-white text-base tracking-[0] leading-[22.4px]">
          Place Your Order
          </span> 
        </Button>
      </div>
    </section>
  );
}
