"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { Product, useStore } from "../../stores/useStore";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import AddToCartDialog from "./AddToCartDialog";

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
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (
      (product.sizes && product.sizes.length ) ||
      (product.colors && product.colors.length)
    ) {
      setIsDialogOpen(true);
    } else {
      addToCart(product, product.sizes?.[0], product.colors?.[0]);
      toast.success(`${product.name} has been added to your cart.`);
    }
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInFavorites) {
      removeFromFavorites(product.id);
      toast.success(`${product.name} has been removed from your favorites.`);
    } else {
      addToFavorites(product);
      toast.success(`${product.name} has been added to your favorites.`);
    }
  };

  return (
    <>
      <Card className="w-full mx-auto group p-0 border-0 rounded-none shadow-none mt-4">
        <CardHeader className="relative p-0 m-0">
          {product.images && product.images.length > 0 && (
            <Link href={`/store/${product.category.name}/${product.id}`}>
              <Image
                src={product.images[0]}
                alt={product.name}
                width={400}
                height={500}
                className="object-cover w-full h-[250px] md:h-[400px] lg:h-[500px]"
              />
            </Link>
          )}

          <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-400">
            {/* Colors section - removed extra wrapper div */}
            {product.colors && product.colors.length > 0 && (
              <div className="flex items-center space-x-2 mb-2 justify-center">
                {product.colors.map((color, index) => (
                  <button
                    key={`${product.id}-${color}-${index}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedColor(color);
                    }}
                    className={`w-4 h-4 md:w-6 md:h-6 rounded-full border-2 cursor-pointer transition-all ${
                      selectedColor === color ? "border-black scale-110" : "border-gray-300"
                    }`}
                    style={{
                      backgroundColor: color,
                    }}
                    title={color}
                  />
                ))}
              </div>
            )}
            
            {/* Action buttons */}
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
          <Link href={`/store/${product.category.name}/${product.id}`}>
            <CardTitle className="text-xs md:text-lg font-medium">
              {product.name.toUpperCase()}
            </CardTitle>
          </Link>
          <p className="text-black text-lg">${product.price}</p>
        </CardContent>
      </Card>
      
      <AddToCartDialog
        product={product}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </>
  );
};

export default ProductCard;
