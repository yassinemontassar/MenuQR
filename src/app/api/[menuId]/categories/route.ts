import { NextResponse } from 'next/server';

import prisma from '@/app/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/utils/auth';


export async function POST(
  req: Request,
  { params }: { params: { menuId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    const userId = session?.user.id
    const body = await req.json();

    const { name, imageUrl } = body;
    console.log(imageUrl)

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }
    
    if (!imageUrl) {
      return new NextResponse("imageUrl is required", { status: 400 });
    }

    if (!params.menuId) {
      return new NextResponse("menuId id is required", { status: 400 });
    }

    const storeByUserId = await prisma.menu.findFirst({
      where: {
        id: params.menuId,
        userId,
      }
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    const category = await prisma.category.create({
      data: {
        name,
        imageUrl: process.env.NEXT_PUBLIC_IMAGE_BASE_URL+"/"+userId+"/categories/"+imageUrl,
        MenuId: params.menuId,
      }
    });
  
    return NextResponse.json(category);
  } catch (error) {
    console.log('[CATEGORIES_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};











export async function GET(
  req: Request,
  { params }: { params: { menuId: string } }
) {
  try {
    const categories = await prisma.category.findMany({
      where: {
        MenuId: params.menuId
      }
    });
  
    return NextResponse.json(categories);
  } catch (error) {
    console.log('[CATEGORIES_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};