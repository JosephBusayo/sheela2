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
    name: 'SMOO1 - SENATOR',
    price: "$299 - $350",
    originalPrice: 40000,
    images: [
      '/images/senator-1.png',
      '/images/model1.png',
      '/images/senator-2.png'
    ],
    category: { name: 'men' },
    subCategory: 'Senator',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Cream', 'White', 'Navy'],
    description: 'Classic Nigerian senator wear made from premium cotton fabric'
  },
  {
    id: 'sw001',
    name: 'SWO01 - ADIRE',
    price: "$299 - $350",
    originalPrice: 39000,
    images: [
      '/images/model1.png',
      '/images/adire-1.png',
      '/images/adire-2.png'
    ],
    category: { name: 'women' },
    subCategory: 'Dresses',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Blue', 'Indigo', 'Navy'],
    description: 'Beautiful traditional Adire dress with modern cut'
  },
  {
    id: 'sw002',
    name: 'SWO02 - ANKARA',
    price: "33000",
    images: [
      '/images/ankara-1.png',
      '/images/ankara-2.png',
      '/images/ankara-3.png'
    ],
    category: { name: 'women' },
    subCategory: 'Dresses',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Red', 'Gold', 'Green'],
    description: 'Vibrant Ankara print dress perfect for special occasions'
  },
  {
    id: 'st001',
    name: 'STO01 - SILK BLOUSE',
    price: "25000",
    images: [
      '/images/model2.png',
      '/images/model3.png',
    ],
    category: { name: 'women' },
    subCategory: 'Tops & Blouses',
    sizes: ['S', 'M', 'L'],
    colors: ['Ivory', 'Black', 'Champagne'],
    description: 'Elegant silk blouse for a sophisticated look.'
  },
  {
    id: 'sk001',
    name: 'SKO01 - EMBROIDERED KAFTAN',
    price: "45000",
    images: [
      '/images/model4.png',
      '/images/model5.jpg',
    ],
    category: { name: 'women' },
    subCategory: 'Kaftans & Abayas',
    sizes: ['One Size'],
    colors: ['Gold', 'Silver', 'Emerald'],
    description: 'Luxurious kaftan with intricate embroidery.'
  },
  {
    id: 'sj001',
    name: 'SJO01 - ANKARA JACKET',
    price: "38000",
    images: [
      '/images/model6.png',
      '/images/model8.png',
    ],
    category: { name: 'women' },
    subCategory: 'Jackets & Outerwear',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Multi-color'],
    description: 'Stylish and versatile Ankara jacket.'
  },
];
