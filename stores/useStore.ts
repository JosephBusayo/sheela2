// stores/useStore.ts - Updated with Clerk integration
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
  // Authentication state
  isLoggedIn: boolean;
  userId: string | null;
  setAuthState: (isLoggedIn: boolean, userId: string | null) => void;

  // Cart functionality
  cartItems: CartItem[];
  addToCart: (product: Product, size?: string, color?: string) => void;
  removeFromCart: (productId: string, size?: string, color?: string) => void;
  updateQuantity: (productId: string, quantity: number, size?: string, color?: string) => void;
  clearCart: () => void;
  
  // Favorites functionality
  favorites: Product[];
  addToFavorites: (product: Product) => void;
  removeFromFavorites: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  
  // Database sync
  syncWithDatabase: () => Promise<void>;
  migrateLocalData: () => Promise<void>;
  
  // Computed values
  cartCount: () => number;
  favoritesCount: () => number;
  cartTotal: () => number;

  // Order functionality
  createOrder: (addressId?: string, notes?: string) => Promise<{ success: boolean; whatsappLink?: string; error?: string }>;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      userId: null,

      setAuthState: (isLoggedIn, userId) => {
        const previousState = get();
        set({ isLoggedIn, userId });
        
        // Auto-migrate local data when user logs in
        if (isLoggedIn && userId && !previousState.isLoggedIn) {
          get().migrateLocalData();
        }
      },

      cartItems: [],
      favorites: [],

      addToCart: async (product, size, color) => {
        const state = get();
        
        if (state.isLoggedIn && state.userId) {
          // Add to database
          try {
            const response = await fetch('/api/cart', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                productId: product.id,
                quantity: 1,
                selectedSize: size,
                selectedColor: color,
              }),
            });

            if (response.ok) {
              // Refresh cart from database
              await get().syncWithDatabase();
            } else {
              throw new Error('Failed to add to cart');
            }
          } catch (error) {
            console.error('Failed to add to cart:', error);
            // Fallback to local storage
          }
        } else {
          // Add to local state
          set((state) => {
            const existingItemIndex = state.cartItems.findIndex(
              (item) => item.id === product.id && item.selectedSize === size && item.selectedColor === color
            );

            if (existingItemIndex >= 0) {
              const updatedItems = [...state.cartItems];
              updatedItems[existingItemIndex] = {
                ...updatedItems[existingItemIndex],
                quantity: updatedItems[existingItemIndex].quantity + 1
              };
              return { cartItems: updatedItems };
            }

            return {
              cartItems: [
                ...state.cartItems,
                { ...product, quantity: 1, selectedSize: size, selectedColor: color },
              ],
            };
          });
        }
      },

      removeFromCart: async (productId, size, color) => {
        const state = get();
        
        if (state.isLoggedIn && state.userId) {
          try {
            const queryParams = new URLSearchParams({
              productId,
              ...(size && { size }),
              ...(color && { color })
            });

            const response = await fetch(`/api/cart?${queryParams}`, {
              method: 'DELETE',
            });

            if (response.ok) {
              await get().syncWithDatabase();
            }
          } catch (error) {
            console.error('Failed to remove from cart:', error);
          }
        } else {
          set((state) => ({
            cartItems: state.cartItems.filter((item) => 
              !(item.id === productId && item.selectedSize === size && item.selectedColor === color)
            ),
          }));
        }
      },

      updateQuantity: async (productId, quantity, size, color) => {
        if (quantity <= 0) {
          get().removeFromCart(productId, size, color);
          return;
        }

        const state = get();
        
        if (state.isLoggedIn && state.userId) {
          try {
            const response = await fetch('/api/cart', {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                productId,
                quantity,
                selectedSize: size,
                selectedColor: color,
              }),
            });

            if (response.ok) {
              await get().syncWithDatabase();
            }
          } catch (error) {
            console.error('Failed to update quantity:', error);
          }
        } else {
          set((state) => ({
            cartItems: state.cartItems.map((item) =>
              item.id === productId && item.selectedSize === size && item.selectedColor === color
                ? { ...item, quantity }
                : item
            ),
          }));
        }
      },

      clearCart: async () => {
        const state = get();
        
        if (state.isLoggedIn && state.userId) {
          try {
            await fetch('/api/cart', { method: 'DELETE' });
          } catch (error) {
            console.error('Failed to clear cart:', error);
          }
        }
        
        set({ cartItems: [] });
      },

      addToFavorites: async (product) => {
        const state = get();
        
        if (state.isLoggedIn && state.userId) {
          try {
            const response = await fetch('/api/favorites', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ productId: product.id }),
            });

            if (response.ok) {
              await get().syncWithDatabase();
            }
          } catch (error) {
            console.error('Failed to add to favorites:', error);
            set((state) => ({
              favorites: [...state.favorites, product],
            }));
          }
        } else {
          set((state) => ({
            favorites: [...state.favorites, product],
          }));
        }
      },

      removeFromFavorites: async (productId) => {
        const state = get();
        if (state.isLoggedIn && state.userId) {
          try {
            const response = await fetch(`/api/favorites?productId=${productId}`, {
              method: 'DELETE',
            });
            if (response.ok) {
              await get().syncWithDatabase();
            }
          } catch (error) {
            console.error('Failed to remove from favorites:', error);
          }
        } else {
          set((state) => ({
            favorites: state.favorites.filter((p) => p.id !== productId),
          }));
        }
      },

      isFavorite: (productId) => {
        return get().favorites.some((p) => p.id === productId);
      },

      syncWithDatabase: async () => {
        const state = get();
        if (state.isLoggedIn && state.userId) {
          try {
            const response = await fetch('/api/sync');
            if (response.ok) {
              const { cart, favorites } = await response.json();
              set({ cartItems: cart, favorites: favorites });
            }
          } catch (error) {
            console.error('Failed to sync with database:', error);
          }
        }
      },

      migrateLocalData: async () => {
        const state = get();
        if (state.cartItems.length > 0 || state.favorites.length > 0) {
          try {
            await fetch('/api/migrate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                cart: state.cartItems,
                favorites: state.favorites,
              }),
            });
            // After migration, sync with DB to get the canonical server state
            await get().syncWithDatabase();
          } catch (error) {
            console.error('Failed to migrate local data:', error);
          }
        }
      },

      cartCount: () => {
        return get().cartItems.reduce((total, item) => total + item.quantity, 0);
      },

      favoritesCount: () => {
        return get().favorites.length;
      },

      cartTotal: () => {
        return get().cartItems.reduce((total, item) => total + parseFloat(item.price) * item.quantity, 0);
      },

      createOrder: async (addressId, notes) => {
        const state = get();
        if (!state.isLoggedIn) {
          return { success: false, error: 'User not logged in' };
        }
        try {
          const response = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ addressId, notes }),
          });
          if (response.ok) {
            const data = await response.json();
            get().clearCart();
            return { success: true, whatsappLink: data.whatsappLink };
          } else {
            const errorData = await response.json();
            return { success: false, error: errorData.error || 'Failed to create order' };
          }
        } catch (error) {
          console.error('Failed to create order:', error);
          return { success: false, error: 'An unexpected error occurred' };
        }
      },
    }),
    {
      name: 'sheela-store-storage', // name of the item in the storage (must be unique)
    }
  )
);
