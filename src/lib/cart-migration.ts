
import { CartItem as ZustandCartItem, Product as ZustandProduct } from '../../stores/useStore'
import prisma from './prisma'

export interface LocalStoreData {
  cartItems: ZustandCartItem[]
  favorites: ZustandProduct[]
}

export class CartMigrationService {
    
  /**
   * Migrate local cart and favorites to database when user logs in
   */
  static async migrateLocalDataToDatabase(userId: string, localData: LocalStoreData) {
    try {
      // Migrate cart items
      for (const item of localData.cartItems) {
        await prisma.cartItem.upsert({
          where: {
            userId_productId_selectedSize_selectedColor: {
              userId,
              productId: item.id,
              selectedSize: item.selectedSize || '',
              selectedColor: item.selectedColor || '',
            },
          },
          update: {
            quantity: {
              increment: item.quantity,
            },
          },
          create: {
            userId,
            productId: item.id,
            quantity: item.quantity,
            selectedSize: item.selectedSize,
            selectedColor: item.selectedColor,
          },
        })
      }

      // Migrate favorites
      for (const favorite of localData.favorites) {
        await prisma.favorite.upsert({
          where: {
            userId_productId: {
              userId,
              productId: favorite.id,
            },
          },
          update: {},
          create: {
            userId,
            productId: favorite.id,
          },
        })
      }

      return { success: true }
    } catch (error) {
      console.error('Migration failed:', error)
      return { success: false, error }
    }
  }

  /**
   * Get user's cart and favorites from database
   */
  static async getUserStoreData(userId: string) {
    const [cartItems, favorites] = await Promise.all([
      prisma.cartItem.findMany({
        where: { userId },
        include: { product: { include: { images: true } } },
      }),
      prisma.favorite.findMany({
        where: { userId },
        include: { product: { include: { images: true } } },
      }),
    ])

    return {
      cartItems: cartItems.map(item => ({
        ...item.product,
        quantity: item.quantity,
        selectedSize: item.selectedSize,
        selectedColor: item.selectedColor,
        images: item.product.images.map(img => img.url),
      })),
      favorites: favorites.map(fav => ({
        ...fav.product,
        images: fav.product.images.map(img => img.url),
      })),
    }
  }

  /**
   * Clear local storage data after successful migration
   */
  static clearLocalStorage() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('sheela-store')
    }
  }
}
