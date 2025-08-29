import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Product } from "../../stores/useStore";

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
    category: 'men',
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
    category: 'women',
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
    category: 'women',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Red', 'Gold', 'Green'],
    description: 'Vibrant Ankara print dress perfect for special occasions'
  },

];