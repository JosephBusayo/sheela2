import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const fabricSamples = await prisma.fabricSample.findMany();
    return NextResponse.json(fabricSamples);
  } catch (error) {
    console.error('Failed to fetch fabric samples', error);
    return NextResponse.json({ error: 'Failed to fetch fabric samples' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const name = data.get('name') as string;
    const image = data.get('image') as File;

    if (!name || !image) {
      return NextResponse.json({ error: 'Missing name or image' }, { status: 400 });
    }

    const formData = new FormData();
    formData.append('file', image);
    formData.append('upload_preset', 'sheela-upload');

    const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    const uploadResult = await response.json();
    const imageUrl = uploadResult.secure_url;

    const fabricSample = await prisma.fabricSample.create({
      data: {
        name,
        image: imageUrl,
      },
    });

    return NextResponse.json(fabricSample);
  } catch (error) {
    console.error('Failed to create fabric sample', error);
    return NextResponse.json({ error: 'Failed to create fabric sample' }, { status: 500 });
  }
}
