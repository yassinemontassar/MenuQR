
import { NextResponse } from "next/server";
import prisma from '@/app/lib/db';
import { auth } from "@/app/utils/auth";


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
        const session = await auth()
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


    
    export async function PATCH (
        req: Request, 
        {params} : {params: {menuId: string, categoryId: string}}
        ) {
        try {
            const body = await req.json();
            const {name} = body;
            const session = await auth()
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
        
        
        const category = await prisma.category.updateMany({
            where: {
                id: params.categoryId,
            },
            data: {
                name
            }
        });
        
        return NextResponse.json(category);
        
        } catch (error) {
            console.log('[CATEGORY_UPDATE]', error);
            return new NextResponse("Internal error", {status: 500});
            
        }
        
        };