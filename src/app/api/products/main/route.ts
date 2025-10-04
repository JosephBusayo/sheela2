import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { images, sizes, colors, fabricSamples, id, ...productData } = data;
    
    if (productData.subCategoryId === '') {
      productData.subCategoryId = null;
    }

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
        fabricSamples: {
          connect: fabricSamples.map((sample: { id: string }) => ({
            id: sample.id,
          })),
        },
      },
      include: {
        images: true,
        sizes: true,
        colors: true,
        fabricSamples: true,
      },
    });
    
    return NextResponse.json({ 
      message: 'Product created successfully', 
      product 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ 
      error: 'Error creating product',
      details: (error as any)?.message || String(error)
    }, { status: 500 });
  }
}

// Improved PUT handler for updating a product
export async function PUT(req: Request) {
  try {
    const data = await req.json();
    const { id, images = [], sizes = [], colors = [], ...productData } = data;
    
    // Validate required fields
    if (!id) {
      return NextResponse.json({ 
        error: 'Product ID is required' 
      }, { status: 400 });
    }
    
    // Check if product exists
    const existingProduct = await prisma.product.findUnique({ 
      where: { id },
      include: {
        images: true,
        sizes: true,
        colors: true,
      }
    });
    
    if (!existingProduct) {
      return NextResponse.json({ 
        error: 'Product not found' 
      }, { status: 404 });
    }
    
    // Use a transaction to ensure data consistency
    const updatedProduct = await prisma.$transaction(async (tx) => {
      // Delete existing related records
      await tx.productImage.deleteMany({ where: { productId: id } });
      await tx.productSize.deleteMany({ where: { productId: id } });
      await tx.productColor.deleteMany({ where: { productId: id } });
      
      // Update the product with new data
      const product = await tx.product.update({
        where: { id },
        data: {
          ...productData,
          updatedAt: new Date(), // Ensure updatedAt is set
          images: {
            create: images.map((img: { url: string; alt: string; order: number }) => ({
              url: img.url,
              alt: img.alt || '',
              order: img.order || 0,
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
          category: true,
          subCategory: true,
        },
      });
      
      return product;
    });
    
    return NextResponse.json({ 
      success: true,
      message: 'Product updated successfully', 
      product: updatedProduct 
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error updating product:', error);
    
    // Handle specific Prisma errors
    if (error instanceof Error) {
      if (error.message.includes('Record to update not found')) {
        return NextResponse.json({ 
          error: 'Product not found' 
        }, { status: 404 });
      }
      
      if (error.message.includes('Unique constraint failed')) {
        return NextResponse.json({ 
          error: 'A product with this information already exists' 
        }, { status: 409 });
      }
    }
    
    return NextResponse.json({
      error: 'Error updating product',
      details: (error as any)?.message || String(error)
    }, { status: 500 });
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
    
    return NextResponse.json({ 
      success: true,
      products 
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ 
      error: 'Error fetching products',
      details: (error as any)?.message || String(error)
    }, { status: 500 });
  }
}
