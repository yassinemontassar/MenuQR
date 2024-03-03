import prisma from "@/app/lib/db";
import { authOptions } from "@/app/utils/auth";
import { getServerSession } from "next-auth";

import { NextResponse } from "next/server";

export async function PATCH (
req: Request, 
{params} : {params: {menuId: string}}
) {
try {
    const session = await getServerSession(authOptions)
const body = await req.json();

const {name, newImage} = body;

const userId = session?.user.id


const menu = await prisma.menu.updateMany({
    where: {
        id: params.menuId,
        userId: userId
    },
    data: {
        name,
        imageUrl: process.env.NEXT_PUBLIC_IMAGE_BASE_URL+"/"+userId+"/logo/"+newImage
    }
})

return NextResponse.json(menu);

} catch (error) {
    console.log('[MENU_PATCH]', error);
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