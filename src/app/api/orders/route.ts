import { NextRequest, NextResponse } from 'next/server'
import { useUser } from '@clerk/nextjs'
import { OrderService } from '@/lib/order-services'

export async function POST(request: NextRequest) {
    const {user} = useUser()
  try {
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { addressId, notes } = await request.json()

    const order = await OrderService.createOrderFromCart(
      user.id,
      addressId,
      notes
    )

    const whatsappLink = OrderService.generateWhatsAppLink(order)

    return NextResponse.json({
      order,
      whatsappLink,
    })
  } catch (error) {
    console.error('Create order error:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Internal server error' 
    }, { status: 500 })
  }
}