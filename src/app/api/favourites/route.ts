import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { getOrCreateUser } from '@/lib/getOrCreateUser';

export async function GET() {
  try {
    const {userId} = await auth()
   
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Ensure user exists
    await getOrCreateUser()

    const favorites = await prisma.favorite.findMany({
      where: { userId: userId },
      include: {
        product: {
          include: { images: true }
        }
      }
    })

    const formattedFavorites = favorites.map(fav => ({
      ...fav.product,
      images: fav.product.images.map(img => img.url),
    }))

    return NextResponse.json({ favorites: formattedFavorites })
  } catch (error) {
    console.error('Get favorites error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const {userId} = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Ensure user exists
    await getOrCreateUser()

    const { productId } = await request.json()

    if (!productId) {
      return NextResponse.json({ error: 'productId is required' }, { status: 400 })
    }

    const product = await prisma.product.findUnique({ where: { id: productId }, include: { images: true }})
    if (!product) {
      return NextResponse.json({ error: 'Invalid productId' }, { status: 400 })
    }

    const favorite = await prisma.favorite.upsert({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
      update: {},
      create: {
        userId: userId,
        productId,
      },
      include: {
        product: {
          include: { images: true }
        }
      }
    })

    return NextResponse.json({
      ...favorite.product,
      images: favorite.product.images.map(img => img.url),
    })
  } catch (error) {
    console.error('Add to favorites error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
   
    const {userId} = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Ensure user exists
    await getOrCreateUser()

    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')

    if (!productId) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 })
    }

    await prisma.favorite.delete({
      where: {
        userId_productId: {
          userId: userId,
          productId,
        },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Remove from favorites error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
