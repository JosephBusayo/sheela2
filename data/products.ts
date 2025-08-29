

import { Product } from "../stores/useStore";


export const sampleProducts: Product[] = [
  {
    id: 'sm001',
    name: 'SMOO1 - SENATOR',
    price: 36000,
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
    price: 35000,
    originalPrice: 39000,
    images: [
      '/images/adire-1.jpg',
      '/images/adire-2.jpg',
      '/images/adire-3.jpg'
    ],
    category: 'women',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Blue', 'Indigo', 'Navy'],
    description: 'Beautiful traditional Adire dress with modern cut'
  },
  {
    id: 'sw002',
    name: 'SWO02 - ANKARA',
    price: 33000,
    images: [
      '/images/ankara-1.jpg',
      '/images/ankara-2.jpg',
      '/images/ankara-3.jpg'
    ],
    category: 'women',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Red', 'Gold', 'Green'],
    description: 'Vibrant Ankara print dress perfect for special occasions'
  },
  {
    id: 'sk001',
    name: 'Traditional Kids Agbada',
    price: 18000,
    originalPrice: 22000,
    images: [
      '/images/kids-agbada-1.jpg',
      '/images/kids-agbada-2.jpg'
    ],
    category: 'kids',
    sizes: ['2-3Y', '4-5Y', '6-7Y', '8-9Y', '10-11Y'],
    colors: ['White', 'Gold', 'Royal Blue'],
    description: 'Traditional agbada for children, perfect for cultural events'
  },
  {
    id: 'su001',
    name: 'Unisex Dashiki Shirt',
    price: 15000,
    images: [
      '/images/dashiki-1.jpg',
      '/images/dashiki-2.jpg',
      '/images/dashiki-3.jpg'
    ],
    category: 'unisex',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Multi', 'Black', 'White'],
    description: 'Comfortable unisex dashiki shirt with traditional prints'
  }
];
