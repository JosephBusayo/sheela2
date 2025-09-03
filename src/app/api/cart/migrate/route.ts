import { NextRequest, NextResponse } from 'next/server'
import { useUser } from '@clerk/nextjs'
import { CartMigrationService } from '@/lib/cart-migration'
export async function POST(request: NextRequest) {
    const {user} = useUser()
  try {
    
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { cartItems, favorites } = body

    const result = await CartMigrationService.migrateLocalDataToDatabase(
      user.id,
      { cartItems, favorites }
    )

    if (result.success) {
      const userData = await CartMigrationService.getUserStoreData(user.id)
      return NextResponse.json({ success: true, data: userData })
    } else {
      return NextResponse.json({ error: 'Migration failed' }, { status: 500 })
    }
  } catch (error) {
    console.error('Cart migration error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

