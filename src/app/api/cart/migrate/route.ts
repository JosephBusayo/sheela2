import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { CartMigrationService } from '@/lib/cart-migration'

export async function POST(request: NextRequest) {
    const { userId } = await auth()
  try {
    
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const body = await request.json()
    const { cartItems, favorites } = body

    const result = await CartMigrationService.migrateLocalDataToDatabase(
      userId,
      { cartItems, favorites }
    )

    if (result.success) {
      const userData = await CartMigrationService.getUserStoreData(userId)
      return NextResponse.json({ success: true, data: userData })
    } else {
      return NextResponse.json({ error: 'Migration failed' }, { status: 500 })
    }
  } catch (error) {
    console.error('Cart migration error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

