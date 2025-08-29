
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Product {
  id: string;
  name: string;
  price: string;
  originalPrice?: number;
  images: string[];
  category: 'women' | 'men' | 'kids' | 'unisex';
  sizes?: string[];
  colors?: string[];
  description?: string;
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

interface StoreState {
  // Cart functionality
  cartItems: CartItem[];
  addToCart: (product: Product, size?: string, color?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  
  // Favorites functionality
  favorites: Product[];
  addToFavorites: (product: Product) => void;
  removeFromFavorites: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  
  // Computed values
  cartCount: () => number;
  favoritesCount: () => number;
  cartTotal: () => number;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      cartItems: [],
      favorites: [],

      addToCart: (product, size, color) => {
        set((state) => {
          const existingItem = state.cartItems.find(
            (item) => item.id === product.id && item.selectedSize === size && item.selectedColor === color
          );

          if (existingItem) {
            return {
              cartItems: state.cartItems.map((item) =>
                item.id === product.id && item.selectedSize === size && item.selectedColor === color
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }

          return {
            cartItems: [
              ...state.cartItems,
              { ...product, quantity: 1, selectedSize: size, selectedColor: color },
            ],
          };
        });
      },

      removeFromCart: (productId) => {
        set((state) => ({
          cartItems: state.cartItems.filter((item) => item.id !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }

        set((state) => ({
          cartItems: state.cartItems.map((item) =>
            item.id === productId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => {
        set({ cartItems: [] });
      },

      addToFavorites: (product) => {
        set((state) => {
          const isAlreadyFavorite = state.favorites.some((fav) => fav.id === product.id);
          
          if (isAlreadyFavorite) {
            return state; // Don't add duplicates
          }

          return {
            favorites: [...state.favorites, product],
          };
        });
      },

      removeFromFavorites: (productId) => {
        set((state) => ({
          favorites: state.favorites.filter((fav) => fav.id !== productId),
        }));
      },

      isFavorite: (productId) => {
        return get().favorites.some((fav) => fav.id === productId);
      },

      cartCount: () => {
        return get().cartItems.reduce((total, item) => total + item.quantity, 0);
      },

      favoritesCount: () => {
        return get().favorites.length;
      },

      cartTotal: () => {
        return get().cartItems.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);
      },
    }),
    {
      name: 'sheela-store', // unique name for localStorage key
      partialize: (state) => ({
        cartItems: state.cartItems,
        favorites: state.favorites,
      }),
    }
  )
);
