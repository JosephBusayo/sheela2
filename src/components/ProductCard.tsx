"use client";

import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Heart, ShoppingBag } from "lucide-react";
import { Product, useStore } from "../../stores/useStore";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  
  const { addToCart, addToFavorites, removeFromFavorites, isFavorite } = useStore();
  const isInFavorites = isFavorite(product.id);


  const handleAddToCart = () => {
    addToCart(product);
  };
  const handleToggleFavorite = () => {
    if (isInFavorites) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };

  return (
    <Card className="lg:w-[455px] sm:w-[360px] md:w-[445px]   mx-4 mb-6 shadow-none rounded-none border-0 gap-1">
      <CardHeader className="relative p-0 mb-0">
        <Swiper
          modules={[Navigation, Pagination]}
          navigation
          pagination={{ clickable: false }}
          autoplay={{ delay: 3000, disableOnInteraction: true }}
          loop={true}
          className="w-full h-[557px]"
        >
          {product.images.map((image, index) => (
            <SwiperSlide key={index}>
              <Image
                src={image}
                alt={product.name}
                fill
                className="object-cover"
              />
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="absolute bottom-2 right-2 mb-2 flex flex-row items-center bg-white border-1 border-black/30 z-10">
          <div className="p-2" onClick={handleToggleFavorite}>
            <Heart
              className="w-6 h-6 cursor-pointer"
              fill={isInFavorites ? "red" : "none"}
              stroke={isInFavorites ? "red" : "currentColor"}
              aria-label={
                isInFavorites ? "Remove from favorites" : "Add to favorites"
              }
            />
          </div>
          <div className="border-l border-gray-300 h-6"></div>
          <div className="p-2">
            <Image
              src="/bag-2.svg"
              alt="cart icon"
              className="cursor-pointer"
              width={24}
              height={24}
              onClick={handleAddToCart}
             
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-0 my-0">
        <CardTitle className="font-normal text-gray-900 text-[20px] mb-0 uppercase justify-start flex">
          {product.name}
        </CardTitle>
        <div className="flex space-x-2 mb-0  justify-start ">
          <span className="font-normal leading-none text-black text-[16px]">
            {product.price.toLocaleString()}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
