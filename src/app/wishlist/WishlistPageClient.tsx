"use client";

import { useStore } from "../../../stores/useStore";
import ProductCard from "@/components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";

export default function WishlistPageClient() {
  const { favorites } = useStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500); 

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="mx-auto px-2 md:pr-8 py-8 mt-10">
      <h1 className="text-3xl font-normal mb-6 text-center uppercase tracking-wider">
        WISHLIST
      </h1>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex flex-col">
              <Skeleton className="h-[300px] w-[300px] rounded-lg" />
              
            </div>
          ))}
        </div>
      ) : favorites.length === 0 ? (
        <p className="text-center">You have no favourite items.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
          {favorites.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
