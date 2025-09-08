import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { images, sizes, colors, ...productData } = data;

    const product = await prisma.product.create({
      data: {
        ...productData,
        images: {
          create: images.map((img: { url: string; alt: string; order: number }) => ({
            url: img.url,
            alt: img.alt,
            order: img.order,
          })),
        },
        sizes: {
          create: sizes.map((size: { size: string }) => ({
            size: size.size,
          })),
        },
        colors: {
          create: colors.map((color: { color: string }) => ({
            color: color.color,
          })),
        },
      },
      include: {
        images: true,
        sizes: true,
        colors: true,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Error creating product' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const data = await req.json();
    const { id, images, sizes, colors, ...productData } = data;

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...productData,
        images: {
          deleteMany: {},
          create: images.map((img: { url: string; alt: string; order: number }) => ({
            url: img.url,
            alt: img.alt,
            order: img.order,
          })),
        },
        sizes: {
          deleteMany: {},
          create: sizes.map((size: { size: string }) => ({
            size: size.size,
          })),
        },
        colors: {
          deleteMany: {},
          create: colors.map((color: { color: string }) => ({
            color: color.color,
          })),
        },
      },
      include: {
        images: true,
        sizes: true,
        colors: true,
      },
    });

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Error updating product' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        images: true,
        sizes: true,
        colors: true,
        category: true,
        subCategory: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Error fetching products' }, { status: 500 });
  }
}
