"use client";
import AdBanner from "@/components/AdBanner";
import BreadCrumb from "@/components/BreadCrumb";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";

import {
  ChevronDown,
  ChevronRightIcon,
  Filter,
  FilterIcon,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Product } from "../../../../stores/useStore";

type ProductWithCounts = Product & {
  createdAt: string;
  _count: {
    cartItems: number;
    orderItems: number;
  };
};
import { Skeleton } from "@/components/ui/skeleton";

interface ProductFromDb {
  id: string;
  name: string;
  price: number;
  originalPrice: number | null;
  description: string | null;
  category: {
    name: string;
  };
  images: { url: string }[];
}

export default function CategoryPageClient({ category }: { category: string }) {
  const [priceRange, setPriceRange] = useState([100, 400]);
  const [products, setProducts] = useState<ProductWithCounts[]>([]);
  const [originalProducts, setOriginalProducts] = useState<ProductWithCounts[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [subCategories, setSubCategories] = useState<
    { id: string; name: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOption, setSortOption] = useState("Default sorting");

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/products/${category}`);
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        const { products: productsFromDb, totalProducts } = data;

        const products = productsFromDb.map((product: ProductFromDb & { createdAt: string; _count: { cartItems: number; orderItems: number } }) => ({
          ...product,
          category: {
            name: product.category.name.toLowerCase() as
              | "women"
              | "men"
              | "kids"
              | "unisex"
              | "fabrics",
          },
          originalPrice:
            product.originalPrice === null ? undefined : product.originalPrice,
          description:
            product.description === null ? undefined : product.description,
          images: product.images.map((image: { url: string }) => image.url),
        })) as ProductWithCounts[];
        setProducts(products);
        setOriginalProducts(products);
        setTotalProducts(totalProducts);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchSubCategories = async () => {
      try {
    const response = await fetch(`/api/subcategories/by-category/${category}`);
        if (!response.ok) {
          throw new Error("Failed to fetch subcategories");
        }
        const data = await response.json();
        setSubCategories(data.subCategories);
      } catch (error) {
        console.error("Failed to fetch subcategories:", error);
      }
    };

    if (category) {
      fetchProducts();
      fetchSubCategories();
    }
  }, [category]);

  const handleSortChange = (option: string) => {
    setSortOption(option);
    let sortedProducts = [...products];
    if (option === "Latest Arrivals") {
      sortedProducts.sort((a, b) => {
        // Sort by createdAt descending
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return dateB.getTime() - dateA.getTime();
      });
      setProducts(sortedProducts);
    } else if (option === "Trending") {
      sortedProducts.sort((a, b) => {
        // Sort by sum of cartItems and orderItems count descending
        const countA = (a._count?.cartItems ?? 0) + (a._count?.orderItems ?? 0);
        const countB = (b._count?.cartItems ?? 0) + (b._count?.orderItems ?? 0);
        return countB - countA;
      });
      setProducts(sortedProducts);
    } else {
      // Default sorting: reset to original order
      setProducts(originalProducts);
    }
  };

  return (
    <div className="">
      <Header />

      <section
        className="w-full h-1/3 md:h-[300px] bg-cover bg-center my-4 flex flex-col justify-center items-center"
        style={{
          backgroundImage: `url('/cat3.png')`,
        }}
      >
        <div className="sm:max-w-2xl flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 text-white py-12">
          <div className="relative z-10 flex w-full flex-grow flex-col items-center self-stretch justify-between">
            <div />
            <div className="relative flex w-full flex-col items-center gap-4">
              <h2 className="text-center text-2xl md:!text-[36px] font-bold leading-[50.4px] tracking-[0] text-white">
                {category.toUpperCase()} STYLES
              </h2>
            </div>
          </div>
        </div>
        <div className="text-white text-sm md:lg">
          <BreadCrumb title={category.toUpperCase()} />
        </div>
      </section>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-2 py-2 m-2 my-6 mb-0">
        <div className="flex flex-row items-center justify-between md:justify-center gap-6 w-full md:w-auto">
          <Sheet>
            <SheetTrigger asChild>
              <div className="flex cursor-pointer flex-row items-center justify-center gap-2">
                <Image
                  src="/filter.svg"
                  alt="filter"
                  className="h-4 w-4 sm:h-2 sm:w-2 md:h-5 md:w-5"
                  width={4}
                  height={4}
                />
                <h3 className="font-bold text-sm md:text-base">Filters</h3>
              </div>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 sm:w-80 px-4">
              <SheetHeader className="flex justify-between items-start">
                <SheetTitle className="text-lg font-semibold">
                  {category.toUpperCase()} STYLES
                </SheetTitle>
              </SheetHeader>
              {/* Category Links */}
              <div className="mt-4 space-y-3 text-sm font-extralight">
                {subCategories.map((subCategory) => (
                  <div
                    key={subCategory.id}
                    className="flex flex-row items-center gap-2"
                  >
                    <Link href="#" className="block hover:underline">
                      {subCategory.name}
                    </Link>
                    <ChevronRightIcon className="w-4 h-4" />
                  </div>
                ))}
              </div>
              {/* Pricing Filter */}
              <div className="mt-6">
                <h3 className="font-semibold text-sm mb-2 tracking-wide">
                  PRICING FILTER
                </h3>
                <Slider
                  defaultValue={[100, 400]}
                  min={0}
                  max={1000}
                  step={10}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="[&_[data-slot=slider-range]]:bg-green-900"
                />

                <div className="flex justify-between items-center mt-3">
                  <Button
                    variant="default"
                    className="bg-green-900 hover:bg-green-800 text-white border-none rounded-none cursor-pointer"
                  >
                    Filter by Price
                  </Button>
                  <span className="text-sm text-gray-600">
                    Price: ${priceRange[0]} - ${priceRange[1]}
                  </span>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <div>
            <p className="font-extralight text-gray-600 text-xs md:text-sm">
              Showing {products.length} of {totalProducts} styles
            </p>
          </div>
        </div>
        <div className="flex flex-row justify-between md:justify-center items-center gap-2 w-full md:w-auto">
          <h3 className="font-bold mr-1 text-sm md:text-base">Sort by</h3>
          <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex flex-row items-center justify-center font-extralight text-gray-600 text-sm md:text-base"
            >
              {sortOption}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleSortChange("Default sorting")}>
              Default sorting
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleSortChange("Latest Arrivals")}>
              Latest Arrivals
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleSortChange("Trending")}>
              Trending
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        </div>
      </div>
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 m-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col space-y-3">
              <Skeleton className="h-[400px] w-full rounded-xl" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-4 overflow-hidden">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
      
      <Footer />
    </div>
  );
}
