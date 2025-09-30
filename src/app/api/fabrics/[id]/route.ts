import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.fabricSample.delete({
      where: { id },
    });
    return NextResponse.json({ message: 'Fabric sample deleted successfully' });
  } catch (error) {
    console.error('Failed to delete fabric sample', error);
    return NextResponse.json({ error: 'Failed to delete fabric sample' }, { status: 500 });
  }
}
