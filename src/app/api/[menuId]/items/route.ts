import { NextResponse } from 'next/server';

import prisma from '@/app/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/utils/auth';


export async function GET(
    req: Request,
    { params }: { params: { menuId: string } }
  ) {
    try {
      const items = await prisma.item.findMany({
        where: {
          MenuId: params.menuId
        },
        include: {
          category: true
        }
      });
    
      return NextResponse.json(items);
    } catch (error) {
      console.log('[ITEMS_GET]', error);
      return new NextResponse("Internal error", { status: 500 });
    }
  };


  export async function POST(
    req: Request,
    { params }: { params: { menuId: string } }
  ) {
    try {
      const session = await getServerSession(authOptions)
      const userId = session?.user.id
      const body = await req.json();
  
      const { categoryId, name, description,  price, imageUrl, discount, isArchived } = body;
  
      if (!userId) {
        return new NextResponse("Unauthenticated", { status: 403 });
      }
  
      if (!name) {
        return new NextResponse("Name is required", { status: 400 });
      }
      
  
  
      if (!params.menuId) {
        return new NextResponse("menuId id is required", { status: 400 });
      }
  
      const storeByUserId = await prisma.menu.findFirst({
        where: {
          id: params.menuId,
          userId,
        },
      });
  
      if (!storeByUserId) {
        return new NextResponse("Unauthorized", { status: 405 });
      }
  
      const item = await prisma.item.create({
        data: {
          MenuId: params.menuId,
          categoryId,
          name,
          description,
          price,
          discount,
          isArchived,
          imageUrl: process.env.NEXT_PUBLIC_IMAGE_BASE_URL+"/"+userId+"/items/"+imageUrl
        }
      });
    
      return NextResponse.json(item);
    } catch (error) {
      console.log('[ITEMS_POST]', error);
      return new NextResponse("Internal error", { status: 500 });
    }
  };
  