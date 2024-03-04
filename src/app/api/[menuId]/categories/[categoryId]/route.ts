
import { NextResponse } from "next/server";
import prisma from '@/app/lib/db';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/utils/auth";

export async function GET (

    req: Request, 
    {params} : {params: { categoryId: string}}
    ) {
    try {   

    if (!params.categoryId) {
        return new NextResponse("Category ID is required!", {status: 400});
    } 

    const category = await prisma.category.findUnique({
        where: {
            id: params.categoryId,
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
    {params} : {params: {menuId: string, categoryId: string}}
    ) {
    try {
        const session = await getServerSession(authOptions)
        const userId = session?.user.id

    
    if (!userId) {
        return new NextResponse("Unauthenticated!", {status: 401});
    }
        
   
    
    if (!params.categoryId) {
        return new NextResponse("Category ID is required!", {status: 400});
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
    
    
    const category = await prisma.category.deleteMany({
        where: {
            id: params.categoryId,
        },
    });
    
    return NextResponse.json(category);
    
    } catch (error) {
        console.log('[CATEGORY_DELETE]', error);
        return new NextResponse("Internal error", {status: 500});
        
    }
    
    };


    