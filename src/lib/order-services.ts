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
   * Generate WhatsApp message for order confirmation
   */
  static generateWhatsAppMessage(order: any) {
    const items = order.items.map((item: any) => 
      `• ${item.product.name} (${item.selectedSize || 'N/A'}, ${item.selectedColor || 'N/A'}) x${item.quantity} - Price: ${item.product.price}`
    ).join('\n')

    const message = `
🛍️ *New Order - ${order.orderNumber}*

👤 *Customer Details:*
Name: ${order.user.name}
Email: ${order.user.email}
Phone: ${order.user.phone || 'Not provided'}

📦 *Order Items:*
${items}

💰 *Order Summary:*
Subtotal: Price to be confirmed
Shipping: Price to be confirmed
*Total: Price to be confirmed*

📍 *Delivery Address:*
${order.address ? `
${order.address.name}
${order.address.address1}
${order.address.address2 || ''}
${order.address.city}, ${order.address.state}
${order.address.country}
Phone: ${order.address.phone}
` : 'No address provided'}

📝 *Notes:* ${order.notes || 'None'}

🕐 *Order Date:* ${new Date(order.createdAt).toLocaleString('en-NG')}
    `.trim()

    return encodeURIComponent(message)
  }

  /**
   * Generate WhatsApp link for order
   */
  static generateWhatsAppLink(order: any) {
    const message = this.generateWhatsAppMessage(order)
    const phoneNumber = process.env.WHATSAPP_BUSINESS_NUMBER?.replace(/[^0-9]/g, '') || '1234567890'
    
    return `https://wa.me/${phoneNumber}?text=${message}`
  }

  /**
   * Mark order as WhatsApp sent
   */
  static async markWhatsAppSent(orderId: string) {
    await prisma.order.update({
      where: { id: orderId },
      data: { whatsappSent: true },
    })
  }
}
