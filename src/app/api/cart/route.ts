
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'

export async function GET() {
    
  try {
    const { userId } = await auth()
  
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const cartItems = await prisma.cartItem.findMany({
      where: { userId: userId },
      include: {
        product: {
          include: { images: true }
        }
      }
    })

    const formattedItems = cartItems.map(item => ({
      ...item.product,
      quantity: item.quantity,
      selectedSize: item.selectedSize || null,
      selectedColor: item.selectedColor || null,
      images: item.product.images.map(img => img.url),
    }))

    return NextResponse.json({ cartItems: formattedItems })
  } catch (error) {
    console.error('Get cart error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { productId, quantity, selectedSize, selectedColor } = await request.json()

    if (!productId) {
      return NextResponse.json({ error: 'productId is required' }, { status: 400 })
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { images: true },
    })

    if (!product) {
      return NextResponse.json({ error: 'Invalid productId' }, { status: 400 })
    }

    const normalizedSize = selectedSize ?? null
    const normalizedColor = selectedColor ?? null

    const existing = await prisma.cartItem.findFirst({
      where: {
        userId,
        productId,
        selectedSize: normalizedSize,
        selectedColor: normalizedColor,
      },
      include: { product: { include: { images: true } } },
    })

    let cartItem
    if (existing) {
      cartItem = await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: { increment: quantity || 1 } },
        include: { product: { include: { images: true } } },
      })
    } else {
      cartItem = await prisma.cartItem.create({
        data: {
          userId,
          productId,
          quantity: quantity || 1,
          selectedSize: normalizedSize,
          selectedColor: normalizedColor,
        },
        include: { product: { include: { images: true } } },
      })
    }

    return NextResponse.json({
      ...cartItem.product,
      quantity: cartItem.quantity,
      selectedSize: cartItem.selectedSize || null,
      selectedColor: cartItem.selectedColor || null,
      images: cartItem.product.images.map(img => img.url),
    })
  } catch (error: any) {
    console.error('Add to cart error:', error)
    const msg = error?.message || 'Internal server error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { productId, quantity, selectedSize, selectedColor } = await request.json()

    if (!productId || typeof quantity !== 'number') {
      return NextResponse.json({ error: 'productId and quantity are required' }, { status: 400 })
    }

    const normalizedSize = selectedSize ?? null
    const normalizedColor = selectedColor ?? null

    if (quantity <= 0) {
      await prisma.cartItem.deleteMany({
        where: {
          userId,
          productId,
          selectedSize: normalizedSize,
          selectedColor: normalizedColor,
        },
      })
      return NextResponse.json({ success: true })
    }

    const result = await prisma.cartItem.updateMany({
      where: {
        userId,
        productId,
        selectedSize: normalizedSize,
        selectedColor: normalizedColor,
      },
      data: { quantity },
    })

    if (result.count === 0) {
      await prisma.cartItem.create({
        data: {
          userId,
          productId,
          quantity,
          selectedSize: normalizedSize,
          selectedColor: normalizedColor,
        },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Update cart quantity error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')
    const size = searchParams.get('size')
    const color = searchParams.get('color')

    if (!productId) {
      // Clear entire cart
      await prisma.cartItem.deleteMany({ where: { userId } })
      return NextResponse.json({ success: true })
    }

    // Delete a specific cart item
    await prisma.cartItem.deleteMany({
      where: {
        userId,
        productId,
        selectedSize: size ?? null,
        selectedColor: color ?? null,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete cart item error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
