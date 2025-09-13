// stores/useStore.ts - Updated with Clerk integration
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Product {
  id: string;
  name: string;
  price: string;
  originalPrice?: number | null;
  images: string[];
  category: {
    name: 'women' | 'men' | 'kids' | 'unisex' | 'fabrics';
  };
  subCategory?: string;
  sizes?: string[];
  colors?: string[];
  description?: string | null;
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  selectedFabric?: string;
}

interface StoreState {
  // Authentication state
  isLoggedIn: boolean;
  userId: string | null;
  setAuthState: (isLoggedIn: boolean, userId: string | null) => void;

  // Cart functionality
  cartItems: CartItem[];
  addToCart: (product: Product, size?: string, color?: string, quantity?: number, fabric?: string) => void;
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

        // Always sync from database on sign-in (even if nothing to migrate)
        if (isLoggedIn && userId) {
          get().syncWithDatabase();
        }

        // Clear cart and favorites when user logs out
        if (!isLoggedIn) {
          set({ cartItems: [], favorites: [] });
        }
      },

      cartItems: [],
      favorites: [],

      addToCart: async (product, size, color, quantity = 1, fabric) => {
        const state = get();
        
        if (state.isLoggedIn && state.userId) {
          // Add to database
          try {
            const response = await fetch('/api/cart', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                productId: product.id,
                quantity,
                selectedSize: size,
                selectedColor: color,
                selectedFabric: fabric,
              }),
            });

            if (response.ok) {
              // Refresh cart from database
              await get().syncWithDatabase();
            } else {
              console.warn('Add to cart failed, falling back to local state');
              set((state) => ({
                cartItems: [
                  ...state.cartItems,
                  { ...product, quantity, selectedSize: size, selectedColor: color, selectedFabric: fabric },
                ],
              }));
            }
          } catch (error) {
            console.error('Failed to add to cart:', error);
            // Fallback to local storage
            set((state) => ({
              cartItems: [
                ...state.cartItems,
                { ...product, quantity, selectedSize: size, selectedColor: color, selectedFabric: fabric },
              ],
            }));
          }
        } else {
          // Add to local state
          set((state) => {
            const existingItemIndex = state.cartItems.findIndex(
              (item) => item.id === product.id && item.selectedSize === size && item.selectedColor === color && item.selectedFabric === fabric
            );

            if (existingItemIndex >= 0) {
              const updatedItems = [...state.cartItems];
              updatedItems[existingItemIndex] = {
                ...updatedItems[existingItemIndex],
                quantity: updatedItems[existingItemIndex].quantity + quantity
              };
              return { cartItems: updatedItems };
            }

            return {
              cartItems: [
                ...state.cartItems,
                { ...product, quantity, selectedSize: size, selectedColor: color, selectedFabric: fabric },
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
            const response = await fetch('/api/favourites', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ productId: product.id }),
            });

            if (response.ok) {
              await get().syncWithDatabase();
            } else {
              console.warn('Add to favourites failed, falling back to local state');
              if (!get().favorites.some((p) => p.id === product.id)) {
                set((state) => ({
                  favorites: [...state.favorites, product],
                }));
              }
            }
          } catch (error) {
            console.error('Failed to add to favorites:', error);
            if (!get().favorites.some((p) => p.id === product.id)) {
              set((state) => ({
                favorites: [...state.favorites, product],
              }));
            }
          }
        } else {
          // Avoid duplicates in local state
          if (!get().favorites.some((p) => p.id === product.id)) {
            set((state) => ({
              favorites: [...state.favorites, product],
            }));
          }
        }
      },

      removeFromFavorites: async (productId) => {
        const state = get();
        if (state.isLoggedIn && state.userId) {
          try {
            const response = await fetch(`/api/favourites?productId=${productId}`, {
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
            const [cartRes, favoritesRes] = await Promise.all([
              fetch('/api/cart'),
              fetch('/api/favourites'),
            ]);
            if (cartRes.ok && favoritesRes.ok) {
              const cartData = await cartRes.json();
              const favoritesData = await favoritesRes.json();
              const cartItems = Array.isArray(cartData) ? cartData : cartData.cartItems;
              const favorites = Array.isArray(favoritesData) ? favoritesData : favoritesData.favorites;
              set({ cartItems: cartItems || [], favorites: favorites || [] });
            }
          } catch (error) {
            console.error('Failed to sync with database:', error);
          }
        }
      },

      migrateLocalData: async () => {
        const { cartItems, favorites, syncWithDatabase } = get();
        if (cartItems.length > 0 || favorites.length > 0) {
          try {
            const response = await fetch('/api/cart/migrate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ cartItems, favorites }),
            });
            if (response.ok) {
              set({ cartItems: [], favorites: [] }); // Clear local state
              await syncWithDatabase(); // Sync with merged server state
            }
          } catch (error) {
            console.error('Failed to migrate local data:', error);
          }
        }
      },

      cartCount: () => get().cartItems.reduce((acc, item) => acc + item.quantity, 0),
      
      favoritesCount: () => get().favorites.length,

      cartTotal: () => {
        return get().cartItems.reduce((acc, item) => {
          // Ensure price is a number, removing currency symbols etc.
          const price = parseFloat(String(item.price).replace(/[^0-9.-]+/g,""));
          return acc + price * item.quantity;
        }, 0);
      },

      createOrder: async (addressId, notes) => {
        const { cartItems, cartTotal, clearCart } = get();
        if (cartItems.length === 0) {
          return { success: false, error: 'Your cart is empty.' };
        }

        try {
          const response = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              cartItems,
              total: cartTotal(),
              addressId,
              notes,
            }),
          });

          const result = await response.json();

          if (response.ok) {
            await clearCart();
            return { success: true, whatsappLink: result.whatsappLink };
          } else {
            return { success: false, error: result.error || 'Failed to create order.' };
          }
        } catch (error) {
          console.error('Failed to create order:', error);
          return { success: false, error: 'An unexpected error occurred.' };
        }
      },
    }),
    {
      name: 'sheela-store-storage', // name of the item in the storage (must be unique)
    }
  )
);
