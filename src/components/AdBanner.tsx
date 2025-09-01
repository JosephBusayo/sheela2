"use client";
import React from "react";
import { Button } from "./ui/button";

export default function AdBanner() {
  return (
      <div className="relative w-full min-h-[400px] bg-[#F3F3F3] flex flex-col justify-center items-center px-5 py-15 overflow-hidden my-5 mb-4">
      
      {/* Decorative rectangles */}
      <div className="absolute bottom-0 left-[182px] w-[195px] h-[164px] bg-[linear-gradient(270deg,_#FFF_0%,_rgba(255,_255,_255,_0.00)_64.87%)] border-2 border-[#f3f3f3]"></div>
      <div className="absolute bottom-0 left-0 w-[236px] h-[265px] bg-[linear-gradient(270deg,_#FFF_0%,_rgba(255,_255,_255,_0.00)_100%)] border-2 border-[#f3f3f3]"></div>
      <div className="absolute bottom-0 right-[182px] w-[195px] h-[164px] bg-[linear-gradient(90deg,_#FFF_0%,_rgba(255,_255,_255,_0.00)_64.87%)] border-2 border-[#f3f3f3]"></div>
      <div className="absolute bottom-0 right-0 w-[236px] h-[265px] bg-[linear-gradient(90deg,_#FFF_0%,_rgba(255,_255,_255,_0.00)_100%)] border-2 border-[#f3f3f3]"></div>
      

      {/* Content */}
      <div className="relative z-10 text-center max-w-2xl flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 gap-6">
        <h2 className="relative mt-[-1.00px] self-stretch text-center text-4xl font-normal leading-[50.4px] tracking-[0] text-black uppercase">
          Place Your Order, Your Way
        </h2>
        
        <p className="relative w-full max-w-[510px] px-4 text-center text-base leading-[22.4px] tracking-[0] text-[#000000b2]">
          Explore Our Catalog For Inspiration Or Send Us Your Unique Style Idea—Order Directly Through WhatsApp And We'll Craft It For You.
        </p>
        
        <Button className="h-[50px] bg-bt-green hover:bg-bt-green/90 px-6 py-2.5 border-0 rounded-none text-white cursor-pointer">
            <span className="text-base font-medium leading-[22.4px] tracking-[0]">
              PLACE YOUR ORDER
            </span>
          </Button>
      </div>
      </div>
  );
}
