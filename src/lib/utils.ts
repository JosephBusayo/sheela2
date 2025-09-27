import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Product } from "../../stores/useStore";

export enum Category {
  WOMEN = "women",
  MEN = "men",
  KIDS = "kids",
  UNISEX = "unisex",
  FABRICS = "fabrics",
}

export enum OrderStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  PROCESSING = "processing",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}








export const sampleProducts: Product[] = [
  {
    id: 'sm001',
    name: 'ZEBRA PRINT ADIRE',
    price: "$400",
    images: [
     "/images/product1.png",
    ],
    category: { name: 'women' },
    subCategory: 'Kaftans & Abayas',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Cream', 'White', 'Navy'],
    description: 'Classic Nigerian senator wear made from premium cotton fabric'
  },
  {
    id: 'sw002',
    name: 'MUDCLOTH PATTERN',
    price: "$400",
    images: [
      "/images/product2.png",
    ],
    category: { name: 'men' },
    subCategory: 'Jackets & Outerwear',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Blue', 'Indigo', 'Navy'],
    description: 'Beautiful traditional Adire dress with modern cut'
  },
  {
    id: 'sf002',
    name: 'FLYING BIRD PATTERN',
    price: "$400",
    images: [
      '/images/product3.png',
     
    ],
    category: { name: 'women' },
    subCategory: 'Dresses',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Red', 'Gold', 'Green'],
    description: 'Vibrant Ankara print dress perfect for special occasions'
  },
  {
    id: 'st001',
    name: 'ANGELIC PATTER',
    price: "$400",
    images: [
      '/images/product4.png',
      
    ],
    category: { name: 'women' },
    subCategory: 'Tops & Blouses',
    sizes: ['S', 'M', 'L'],
    colors: ['Ivory', 'Black', 'Champagne'],
    description: 'Elegant silk blouse for a sophisticated look.'
  },
 
];
