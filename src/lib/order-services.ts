import prisma from "./prisma"

export class OrderService {
  /**
   * Create order from cart items
   */
  static async createOrderFromCart(userId: string, addressId?: string, notes?: string) {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: { product: true },
    })

    if (cartItems.length === 0) {
      throw new Error('Cart is empty')
    }

    // Calculate totals
    

  

    // Generate order number
    const orderNumber = `SH${Date.now()}`

    // Create order
    const order = await prisma.order.create({
      data: {
        userId,
        orderNumber,
        subtotal: 0,
        total: 0,
        shipping: 0,
        notes,
        items: {
          create: cartItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: 0, 
            selectedSize: item.selectedSize,
            selectedColor: item.selectedColor,
          })),
        },
      },
      include: {
        items: {
          include: { product: true },
        },
        user: true,
      },
    })

    // Clear cart after order creation
    await prisma.cartItem.deleteMany({
      where: { userId },
    })

    return order
  }

  /**
   * Get all orders
   */
  static async getAllOrders() {
    const orders = await prisma.order.findMany({
      include: {
        user: true,
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return orders;
  }
}
