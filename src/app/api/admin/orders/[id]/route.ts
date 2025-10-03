import { NextResponse } from 'next/server';
import { PrismaClient, OrderStatus } from '@prisma/client';

const prisma = new PrismaClient();

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status } = await request.json();

    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }

    // Validate and cast the status to the OrderStatus enum
    const orderStatus = status.toUpperCase() as OrderStatus;
    if (!Object.values(OrderStatus).includes(orderStatus)) {
      return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status: orderStatus },
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Failed to update order status:', error);
    return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 });
  }
}
