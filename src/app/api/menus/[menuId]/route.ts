import prisma from "@/app/lib/db";
import { auth } from "@/app/utils/auth";

import { NextResponse } from "next/server";

export async function PATCH (
req: Request, 
{params} : {params: {menuId: string}}
) {
try {
    const session = await auth()
const body = await req.json();

const {name, imageUrl, type, startTime, endTime, facebookLink, instagramLink} = body;

const userId = session?.user.id


const menu = await prisma.menu.updateMany({
    where: {
        id: params.menuId,
        userId: userId
    },
    data: {
        name,
        type,
        startTime,
        endTime,
        facebookLink,
        instagramLink,
        imageUrl,
    }
})

return NextResponse.json(menu);

} catch (error) {
    console.log('[MENU_PATCH]', error);
    return new NextResponse("Internal error", {status: 500});
    
}

};


export async function GET (

    req: Request, 
    {params} : {params: {menuId: string}}
    ) {
    try {   

    if (!params.menuId) {
        return new NextResponse("menuId ID is required!", {status: 400});
    } 

    const menu = await prisma.menu.findUnique({
        where: {
            id: params.menuId,
        },
    });
    
    
    return NextResponse.json(menu);
    
    } catch (error) {
        console.log('MENU_GET]', error);
        return new NextResponse("Internal error", {status: 500});
        
    }
    
    };


// export async function DELETE (
//     req: Request, 
//     {params} : {params: {storeId: string}}
//     ) {
//     try {
//     const { userId } = auth();
   

    
//     if (!userId) {
//         return new NextResponse("Unauthenticated!", {status: 401});
//     }
        
   
    
//     if (!params.storeId) {
//         return new NextResponse("Store ID is required!", {status: 400});
//     }
    
//     const store = await prismadb.store.deleteMany({
//         where: {
//             id: params.storeId,
//             userId: userId
//         },
//     });
    
//     return NextResponse.json(store);
    
//     } catch (error) {
//         console.log('[STORE_DELETE]', error);
//         return new NextResponse("Internal error", {status: 500});
        
//     }
    
//     }