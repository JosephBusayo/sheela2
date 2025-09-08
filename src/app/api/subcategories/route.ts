import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { name, categoryId } = await request.json();
    const newSubCategory = await prisma.subCategory.create({
      data: { 
        name,
        categoryId
      },
    });
    return NextResponse.json(newSubCategory, { status: 201 });
  } catch (error) {
    console.error('Error creating subcategory:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
