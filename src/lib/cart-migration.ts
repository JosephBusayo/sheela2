
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
        const selectedSize = item.selectedSize ?? null
        const selectedColor = item.selectedColor ?? null

        const existing = await prisma.cartItem.findFirst({
          where: {
            userId,
            productId: item.id,
            selectedSize,
            selectedColor,
          },
        })

        if (existing) {
          await prisma.cartItem.update({
            where: { id: existing.id },
            data: {
              quantity: { increment: item.quantity },
            },
          })
        } else {
          await prisma.cartItem.create({
            data: {
              userId,
              productId: item.id,
              quantity: item.quantity,
              selectedSize,
              selectedColor,
            },
          })
        }
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
        selectedSize: item.selectedSize || null,
        selectedColor: item.selectedColor || null,
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
