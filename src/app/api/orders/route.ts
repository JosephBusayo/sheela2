import { NextRequest, NextResponse } from 'next/server'

import { OrderService } from '@/lib/order-services'
import { auth } from '@clerk/nextjs/server';

export async function POST(request: NextRequest) {
   
  try {
    const {userId} = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { addressId, notes } = await request.json()

    const order = await OrderService.createOrderFromCart(
      userId,
      addressId,
      notes
    )

    return NextResponse.json({
      order,
    })
  } catch (error) {
    console.error('Create order error:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Internal server error' 
    }, { status: 500 })
  }
}
