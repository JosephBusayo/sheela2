
import { NextRequest, NextResponse } from 'next/server'
import { useUser } from '@clerk/nextjs'
import prisma from '@/lib/prisma'

const {user} = useUser()
export async function GET() {
    
  try {
   
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const cartItems = await prisma.cartItem.findMany({
      where: { userId: user?.id },
      include: {
        product: {
          include: { images: true }
        }
      }
    })

    const formattedItems = cartItems.map(item => ({
      ...item.product,
      quantity: item.quantity,
      selectedSize: item.selectedSize,
      selectedColor: item.selectedColor,
      images: item.product.images.map(img => img.url),
    }))

    return NextResponse.json(formattedItems)
  } catch (error) {
    console.error('Get cart error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { productId, quantity, selectedSize, selectedColor } = await request.json()

    const cartItem = await prisma.cartItem.upsert({
      where: {
        userId_productId_selectedSize_selectedColor: {
          userId: user.id,
          productId,
          selectedSize: selectedSize || null,
          selectedColor: selectedColor || null,
        },
      },
      update: {
        quantity: {
          increment: quantity || 1,
        },
      },
      create: {
        userId: user.id,
        productId,
        quantity: quantity || 1,
        selectedSize,
        selectedColor,
      },
      include: {
        product: {
          include: { images: true }
        }
      }
    })

    return NextResponse.json({
      ...cartItem.product,
      quantity: cartItem.quantity,
      selectedSize: cartItem.selectedSize,
      selectedColor: cartItem.selectedColor,
      images: cartItem.product.images.map(img => img.url),
    })
  } catch (error) {
    console.error('Add to cart error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}