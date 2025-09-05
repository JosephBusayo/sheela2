import { NextRequest, NextResponse } from 'next/server'
import { useUser } from '@clerk/nextjs'
import prisma from '@/lib/prisma'
const {user} = useUser()
export async function GET() {
  try {
   
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const favorites = await prisma.favorite.findMany({
      where: { userId: user.id },
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

    return NextResponse.json(formattedFavorites)
  } catch (error) {
    console.error('Get favorites error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { productId } = await request.json()

    const favorite = await prisma.favorite.create({
      data: {
        userId: user.id,
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
   
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')

    if (!productId) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 })
    }

    await prisma.favorite.delete({
      where: {
        userId_productId: {
          userId: user.id,
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
