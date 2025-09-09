import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

import { Prisma } from '@prisma/client';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: subCategoryId } = await params;

    // Check if the subcategory exists
    const subCategory = await prisma.subCategory.findUnique({
      where: { id: subCategoryId },
    });

    if (!subCategory) {
      return NextResponse.json({ error: 'Subcategory not found' }, { status: 404 });
    }

    // Attempt to delete the subcategory
    await prisma.subCategory.delete({
      where: { id: subCategoryId },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting subcategory:', error);

    // Handle specific Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Foreign key constraint failed (P2003) - subcategory is in use
      if (error.code === 'P2003') {
        return NextResponse.json(
          { error: 'Cannot delete subcategory because it is still in use by products.' },
          { status: 409 } // 409 Conflict
        );
      }
    }

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
