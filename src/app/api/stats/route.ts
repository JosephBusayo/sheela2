import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { OrderStatus } from '@prisma/client';

export async function GET() {
  try {
    const numListings = await prisma.product.count();
    const itemsInCart = await prisma.cartItem.count();
    const websiteVisits = await prisma.websiteVisit.count();

    const completedOrders = await prisma.order.count({
      where: {
        status: {
          in: [OrderStatus.DELIVERED, OrderStatus.SHIPPED],
        },
      },
    });

    const pendingOrders = await prisma.order.count({
      where: { status: OrderStatus.PENDING },
    });

    const now = new Date();
    const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));

    const monthlySales = await prisma.order.aggregate({
      _sum: {
        total: true,
      },
      where: {
        status: {
          in: [OrderStatus.DELIVERED, OrderStatus.SHIPPED],
        },
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
    });

    return NextResponse.json({
      numListings,
      itemsInCart,
      websiteVisits,
      completedOrders,
      pendingOrders,
      monthlySales: monthlySales._sum.total ?? 0,
    });
  } catch (error) {
    console.error('[STATS_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
