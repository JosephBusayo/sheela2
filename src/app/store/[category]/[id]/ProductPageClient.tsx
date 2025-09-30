"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import FsLightbox from "fslightbox-react";
import colorNamer from "color-namer";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Minus, Plus } from "lucide-react";
import { ProductImage } from "@prisma/client";
import { toast } from "sonner";
import { Product } from "../../../../../stores/useStore";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";
import SizeGuide from "@/components/SizeGuide";
import { useStore } from "../../../../../stores/useStore";
import { useUser, RedirectToSignIn } from "@clerk/nextjs";
import { FabricSamplesDialog } from "@/components/FabricSamplesDialog";

// Get WhatsApp number from env
const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_BUSINESS_NUMBER;

interface ProductSize {
  id: string;
  size: string;
  productId: string;
}

interface ProductColor {
  id: string;
  color: string;
  productId: string;
}

interface FabricSample {
  id: string;
  name: string;
  image: string;
}

interface ProductWithImages {
  id: string;
  name: string;
  price: string;
  originalPrice?: number | null;
  images: ProductImage[];
  category: {
    name: 'women' | 'men' | 'kids' | 'unisex' | 'fabrics';
  };
  subCategory?: string;
  sizes: ProductSize[];
  colors: ProductColor[];
  description?: string | null;
  selectedColor?: string;
  createdAt: Date;
  sales: number;
  fabricSamples: FabricSample[];
}

interface ProductPageClientProps {
  product: ProductWithImages;
  similarProducts: ProductWithImages[];
}

const ProductPageClient: React.FC<ProductPageClientProps> = ({ product, similarProducts }) => {
  
  const { isSignedIn } = useUser();
  const pathname = usePathname();
  const category = pathname.split("/")[2];
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [lightboxController, setLightboxController] = useState({
    toggler: false,
    slide: 1,
  });
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes?.[0]?.size || "xs");
  const [selectedColor, setSelectedColor] = useState<string>(product.colors?.[0]?.color || "");
  const [selectedLength, setSelectedLength] = useState<string>("MEDIUM");
  const [shouldRedirectToSignIn, setShouldRedirectToSignIn] = useState(false);

  const getColorHex = (colorName: string) => {
    try {
      const names = colorNamer(colorName);
      return names.ntc[0].hex;
    } catch (e) {
      return '#000000'; // Default to black if color name is not found
    }
  };

  function openLightboxOnSlide(number: number) {
    setLightboxController({
      toggler: !lightboxController.toggler,
      slide: number,
    });
  }
const { addToCart, addToFavorites, removeFromFavorites, isFavorite } = useStore();

  const handleAddToCart = async () => {
    const productToAdd = {
      ...product,
      images: product.images.map((image) => image.url),
      sizes: product.sizes?.map((s) => s.size) || [],
      colors: product.colors?.map((c) => c.color) || [],
      category: { name: category as 'women' | 'men' | 'kids' | 'unisex' | 'fabrics' },
      createdAt: product.createdAt,
      sales: product.sales,
    };
    try {
      await addToCart(productToAdd, selectedSize, selectedColor, quantity);
      toast.success(`${product.name} has been added to your cart.`);
    } catch (e) {
      toast.error('Failed to add to cart');
    }
  };

  const handlePlaceOrder = () => {
    if (!isSignedIn) {
      setShouldRedirectToSignIn(true);
      return;
    }
    if (!whatsappNumber) {
      toast.error("WhatsApp number not configured.");
      return;
    }
    const message = `Hello, I would like to place an order:\n
Product: ${product.name}
Price: ${product.price}
Quantity: ${quantity}
Size: ${selectedSize.toUpperCase()}
Color: ${selectedColor}
Length: ${selectedLength}
Product Link: ${typeof window !== "undefined" ? window.location.href : ""}`;

    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  if (shouldRedirectToSignIn) {
    return <RedirectToSignIn signInForceRedirectUrl={pathname} />;
  }

  return (
    
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 lg:max-w-7xl mx-auto mt-6">
      {/* LEFT: Product Gallery */}
      <div className="flex flex-col md:flex-row gap-4 items-start">
        {/* Thumbnails */}
        <div className="w-full md:w-24 flex-shrink-0 order-last md:order-first">
          <Swiper
            onSwiper={setThumbsSwiper}
            direction="horizontal"
            breakpoints={{
              768: {
                direction: "vertical",
                slidesPerView: 7,
              },
            }}
            spaceBetween={10}
            slidesPerView={5}
            freeMode={true}
            watchSlidesProgress={true}
            modules={[FreeMode, Navigation, Thumbs]}
            className="h-24 md:h-[600px] lg:[700px] w-full"
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
        <div className="flex-1 w-full">
          <div className="w-full h-[350px] md:w-[300px] md:h-[450px] lg:w-[480px] lg:h-[600px]">
            <Swiper
              style={{ "--swiper-navigation-color": "#000" } as any}
              spaceBetween={5}
              navigation={true}
              thumbs={{ swiper: thumbsSwiper }}
              modules={[FreeMode, Navigation, Thumbs]}
              className="w-full h-full"
            >
              {product.images.map((image, index) => (
                <SwiperSlide
                  key={image.id}
                  onClick={() => openLightboxOnSlide(index + 1)}
                >
                  <img
                    src={image.url}
                    alt={image.alt ?? product.name}
                    className="w-full h-full rounded-none object-cover cursor-pointer"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
      {/* RIGHT: Product Info */}
      <div className="md:ml-8 lg:ml-16">
        <h1 className="md:text-2xl text-xl font-semibold mb-2">{product.name}</h1>
        <p className="md:text-lg font-normal text-gray-800 mb-4">
          ${product.price}
        </p>

        <p className="text-sm md:text-lg text-gray-600 mb-6">{product.description}</p>

        {/* Size Select */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium">Select Size</label>
            <SizeGuide />
          </div>
          <div className="flex gap-2">
            {product.sizes?.map((sizeObj) => (
              <Button
                key={sizeObj.id}
                variant={selectedSize === sizeObj.size ? "default" : "outline"}
                onClick={() => setSelectedSize(sizeObj.size)}
                className="rounded-none text-xs md:text-sm px-2 md:px-4 py-1 md:py-2"
              >
                {sizeObj.size.toUpperCase()}
              </Button>
            ))}
          </div>
        </div>

        {/* Length Select */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Length</label>
          <div className="flex gap-2">
            <Button
              variant={selectedLength === "MEDIUM" ? "default" : "outline"}
              onClick={() => setSelectedLength("MEDIUM")}
              className="rounded-none text-xs md:text-sm px-2 md:px-4 py-1 md:py-2"
            >
              MEDIUM
            </Button>
            <Button
              variant={selectedLength === "REGULAR" ? "default" : "outline"}
              onClick={() => setSelectedLength("REGULAR")}
              className="rounded-none text-xs md:text-sm px-2 md:px-4 py-1 md:py-2"
            >
              REGULAR
            </Button>
            <Button
              variant={selectedLength === "TALL" ? "default" : "outline"}
              onClick={() => setSelectedLength("TALL")}
              className="rounded-none text-xs md:text-sm px-2 md:px-4 py-1 md:py-2"
            >
              TALL
            </Button>
          </div>
        </div>

        {/* Color Select */}
        {product.colors && product.colors.length > 0 && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Select Colour</label>
            <TooltipProvider>
              <div className="flex gap-4">
                {product.colors.map((colorObj) => (
                  <Tooltip key={colorObj.id}>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={() => setSelectedColor(colorObj.color)}
                        className={`md:w-8 md:h-8 w-4 h-4 rounded-none cursor-pointer border-2 ${
                          selectedColor === colorObj.color ? "border-b-gray-600" : "border-transparent"
                        }`}
                        style={{ backgroundColor: `#${getColorHex(colorObj.color)}` }}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{colorObj.color.toLowerCase()}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </TooltipProvider>
          </div>
        )}

        <div className="flex flex-row justify-end">
           {product.fabricSamples && product.fabricSamples.length > 0 && (
          <FabricSamplesDialog fabricSamples={product.fabricSamples} />
        )}
        </div>

{/* Quantity Selector */}
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
          >
            <Minus className="md:h-4 md:w-4 h-3 w-3" />
          </Button>
          <span className="md:text-lg text-sm font-medium">{quantity}</span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setQuantity(quantity + 1)}
          >
            <Plus className="md:h-4 h-3 w-3 md:w-4" />
          </Button>
        </div>
        
       
   

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" className="rounded-none cursor-pointer flex-1 uppercase" onClick={handleAddToCart}>
            <Image src={"/bag-2.svg"} alt="package" width={14} height={14} />
            Add to Cart
          </Button>
          <Button className="bg-bt-green hover:bg-bt-green/90 rounded-none cursor-pointer px-8 flex-1 uppercase" onClick={handlePlaceOrder}>Buy Now</Button>
        </div>
       
      </div>
      <FsLightbox
        toggler={lightboxController.toggler}
        sources={product.images.map((image) => image.url)}
        slide={lightboxController.slide}
      />
    </div>
   
  );
};

export default ProductPageClient;
