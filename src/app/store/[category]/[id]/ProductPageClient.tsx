"use client";

import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { Product, ProductImage } from "@prisma/client";


import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import Header from "@/components/Header";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import Image from "next/image";

interface ProductWithImages extends Product {
  images: ProductImage[];
}

interface ProductPageClientProps {
  product: ProductWithImages;
  similarProducts: ProductWithImages[];
}

const ProductPageClient: React.FC<ProductPageClientProps> = ({ product, similarProducts }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);

  return (
    
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:max-w-7xl mx-auto mt-6">
      {/* LEFT: Product Gallery */}
      <div className="flex flex-col-reverse md:flex-row gap-4 items-start">
        {/* Thumbnails */}
        <div className="w-full md:w-24 flex-shrink-0">
          <Swiper
            onSwiper={setThumbsSwiper}
            direction="horizontal"
            breakpoints={{
              768: {
                direction: "vertical",
              },
            }}
            spaceBetween={10}
            slidesPerView={7}
            freeMode={true}
            watchSlidesProgress={true}
            modules={[FreeMode, Navigation, Thumbs]}
            className="h-24 md:h-[600px]"
          >
            {product.images.map((image) => (
              <SwiperSlide key={image.id}>
                <img
                  src={image.url}
                  alt={image.alt ?? product.name}
                  className="cursor-pointer rounded-none border h-20 w-20 object-cover"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Main Image */}
        <div className="flex-1">
          <div className="md:w-[450px] md:h-[600px] lg:w-[520px] lg:h-[600px]">
            <Swiper
              style={{ "--swiper-navigation-color": "#000" } as any}
              spaceBetween={5}
              navigation={true}
              thumbs={{ swiper: thumbsSwiper }}
              modules={[FreeMode, Navigation, Thumbs]}
              className="w-full h-full"
            >
              {product.images.map((image) => (
                <SwiperSlide key={image.id}>
                  <img
                    src={image.url}
                    alt={image.alt ?? product.name}
                    className="w-full h-full rounded-none object-cover"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
      {/* RIGHT: Product Info */}
      <div className="lg:ml-20">
        <h1 className="text-2xl font-semibold mb-2">{product.name}</h1>
        <p className="text-lg font-bold text-gray-800 mb-4">
          {product.price}
        </p>

        <p className="text-sm text-gray-600 mb-6">{product.description}</p>
          {/* Fabric Select */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Select Fabric Type</label>
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Maintain Same Fabric" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="same">Maintain Same Fabric</SelectItem>
              <SelectItem value="custom">Custom Fabric</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Size Select */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium">Select Size</label>
            <Link href="#" className="text-xs underline text-gray-600">
              See Size Guide
            </Link>
          </div>
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="XS" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="xs">XS</SelectItem>
              <SelectItem value="s">S</SelectItem>
              <SelectItem value="m">M</SelectItem>
              <SelectItem value="l">L</SelectItem>
              <SelectItem value="xl">XL</SelectItem>
              <SelectItem value="xxl">XXL</SelectItem>
            </SelectContent>
          </Select>
        </div>

{/* Quantity Selector */}
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="text-lg font-medium">{quantity}</span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setQuantity(quantity + 1)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
         {/* Shipping Info */}
        <p className="text-sm font-semibold mb-2">Made-To-Order Only.</p>
        <div className="flex flex-row items-center mb-6 gap-2">
          <Image src={"/package.svg"} alt="shipping" width={16} height={16}/>  
          <p className="text-sm text-gray-600 ">Ships in 10 - 14 Days</p>
        </div>
        
        <p className="text-sm font-semibold text-black border bg-[#293A2826] p-3 rounded-none mb-6 capitalize">
          Please note that the Place Order button redirects you to WhatsApp so you can 
          discuss with Sheela and also ask necessary questions.
        </p>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-none cursor-pointer"> <Image src={"/bag-2.svg"} alt="package" width={14} height={14}/>Add to Cart</Button>
          <Button className="bg-bt-green hover:bg-bt-green/90 rounded-none cursor-pointer px-8">Place Order</Button>
        </div>
      </div>

    </div>
   
  );
};

export default ProductPageClient;
