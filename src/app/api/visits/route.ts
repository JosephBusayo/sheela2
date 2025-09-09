import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST() {
  try {
    await prisma.websiteVisit.create({
      data: {},
    });
    return new NextResponse('Visit recorded', { status: 200 });
  } catch (error) {
    console.error('[VISITS_POST]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
