
import { NextResponse } from "next/server";
import prisma from '@/app/lib/db';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/utils/auth";

export async function GET (

    req: Request, 
    {params} : {params: { itemId: string}}

    ) {
    try {   

    if (!params.itemId) {
        return new NextResponse("Item ID is required!", {status: 400});
    } 

    const category = await prisma.item.findUnique({
        where: {
            id: params.itemId,
        },
    });
    
    
    return NextResponse.json(category);
    
    } catch (error) {
        console.log('CATEGORY_GET]', error);
        return new NextResponse("Internal error", {status: 500});
        
    }
    
    };
    





export async function DELETE (
    req: Request, 
    {params} : {params: {menuId: string, itemId: string}}
    ) {
    try {
        const session = await getServerSession(authOptions)
        const userId = session?.user.id

    
    if (!userId) {
        return new NextResponse("Unauthenticated!", {status: 401});
    }
        
   
    
    if (!params.itemId) {
        return new NextResponse("Item ID is required!", {status: 400});
    }

    const menuByUserId = await prisma.menu.findFirst({
        where: {
            id: params.menuId,
            userId
        }
    });
    
    if (!menuByUserId) {
        return new NextResponse("Unauthorized", {status: 403});
    }
    
    
    const item = await prisma.item.deleteMany({
        where: {
            id: params.itemId,
        },
    });
    
    return NextResponse.json(item);
    
    } catch (error) {
        console.log('[ITEM_DELETE]', error);
        return new NextResponse("Internal error", {status: 500});
        
    }
    
    };


    