import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const numListings = await prisma.product.count();
    const itemsInCart = await prisma.cartItem.count();
    // const websiteVisits = await prisma.websiteVisit.count();

    // Placeholders for stats not directly available in the current schema
    let whatsappMessages = 0; 

    return NextResponse.json({
      numListings,
      itemsInCart,
      // websiteVisits,
      whatsappMessages,
    });
  } catch (error) {
    console.error('[STATS_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
