"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Heart, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { Product, useStore } from "../../stores/useStore";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { sampleProducts } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, addToFavorites, removeFromFavorites, isFavorite } =
    useStore();
  const isInFavorites = isFavorite(product.id);
  const [selectedColor, setSelectedColor] = useState(
    product.colors && product.colors.length > 0 ? product.colors[0] : ""
  );

  const handleAddToCart = () => {
    addToCart({ ...product, selectedColor });
    toast.success(`${product.name} has been added to your cart.`);
  };

  const handleToggleFavorite = () => {
    if (isInFavorites) {
      removeFromFavorites(product.id);
      toast.success(`${product.name} has been removed from your favorites.`);
    } else {
      addToFavorites(product);
      toast.success(`${product.name} has been added to your favorites.`);
    }
  };

  return (
    <Card className="w-full mx-auto group p-0 border-0 rounded-none shadow-none mt-4">
      <CardHeader className="relative p-0 m-0">
        <Image
          src={product.images[0]}
          alt={product.name}
          width={400}
          height={500}
          className="object-cover w-full h-[250px] md:h-[400px] lg:h-[500px]"
        />
       
        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-400">
          <div> {product.colors && product.colors.length > 0 && (
        <div className="flex items-center space-x-2 mb-2 justify-center">
          {product.colors.map((color) => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              className={`w-4 h-4 md:w-6 md:h-6 rounded-full border-2 cursor-pointer ${
                selectedColor === color ? "border-black" : "border-gray-300"
              }`}
              style={{ backgroundColor: color.toLowerCase() }}
            ></button>
          ))}
        </div>
        )}
        </div>
          <div className="flex justify-between items-center">
            <button
              onClick={handleToggleFavorite}
              className="bg-white text-black px-2 py-1 lg:px-6 lg:py-4 flex items-center gap-1"
            >
              <Heart
                className="w-3 h-3 lg:w-5 md:h-5 cursor-pointer"
                fill={isInFavorites ? "red" : "none"}
                stroke={isInFavorites ? "red" : "currentColor"}
              />
              <span className="text-xs lg:text-sm">WISHLIST</span>
            </button>
            <button
              onClick={handleAddToCart}
              className="bg-green-800 text-white px-2 py-1 md:px-2 md:py-2 lg:px-6 lg:py-4 flex items-center gap-1 cursor-pointer"
            >
              <ShoppingBag className="w-3 h-3 lg:w-5 lg:h-5" />
              <span className="text-xs lg:text-sm font-light">ADD TO CART</span>
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="py-0 px-1 text-center m-0">
        <div className="block md:hidden mb-2">
          {product.colors && product.colors.length > 0 && (
        <div className="flex items-center space-x-2 mb-2 justify-center">
          {product.colors.map((color) => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              className={`w-4 h-4 rounded-full border-2 cursor-pointer ${
                selectedColor === color ? "border-black" : "border-gray-300"
              }`}
              style={{ backgroundColor: color.toLowerCase() }}
            ></button>
          ))}
        </div>
        )}
        </div>
       
        <CardTitle className="text-xs  md:text-lg font-medium">{product.name}</CardTitle>
        <p className="text-black text-lg">{product.price}</p>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
