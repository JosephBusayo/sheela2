"use client";

import React from "react";
import ProductCard from "@/components/ProductCard";
import { Product } from "../../stores/useStore";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";


interface ProductGridProps {
  products: Product[];
  title?: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, title }) => {
  return (
    <div className="w-full my-8 px-2 md:px-4 lg:px-8">
      {title && <h2 className="text-xl md:text-3xl font-light my-6 text-center tracking-widest px-3">{title}</h2>}
      <Swiper
        className="product-grid-swiper"
        modules={[Navigation, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 10000, disableOnInteraction: true }}
        loop={true}
        breakpoints={{
          180: {
            slidesPerView: 2,
            spaceBetween: 10,
          },

          640: {
            slidesPerView: 2,
            spaceBetween: 10,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 30,
          },
        }}
      >
        {products.map((product) => (
          <SwiperSlide key={product.id}>
            <ProductCard product={product} />
          </SwiperSlide>
        ))}
      </Swiper>
     
    </div>
  );
};

export default ProductGrid;
