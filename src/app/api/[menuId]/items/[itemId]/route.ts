import { NextResponse } from "next/server";
import prisma from "@/app/lib/db";
import { auth } from "@/app/utils/auth";

export async function GET(
  req: Request,
  { params }: { params: { itemId: string } }
) {
  try {
    if (!params.itemId) {
      return new NextResponse("Item ID is required!", { status: 400 });
    }

    const Item = await prisma.item.findUnique({
      where: {
        id: params.itemId,
      },
    });

    return NextResponse.json(Item);
  } catch (error) {
    console.log("ITEM_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { menuId: string; itemId: string } }
) {
  try {

    const body = await req.json();

    const {name, description, price, imageUrl} = body;
    const session = await auth()
    const userId = session?.user.id;

     if (!userId) {
         return new NextResponse("Unauthenticated!", {status: 401});
     }
        if (!name) {
            return new NextResponse("name is required", {status: 400});
        }

        if (!price) {
            return new NextResponse("price is required", {status: 400});
        }


        if (!imageUrl) {
          return new NextResponse("image is required", {status: 400});
      }




        if (!params.itemId) {
            return new NextResponse("Item ID is required!", {status: 400});
        }

    const menuByUserId = await prisma.menu.findFirst({
      where: {
        id: params.menuId,
        userId,
      },
    });

    if (!menuByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

      const item =   await prisma.item.update({
            where: {
              id: params.itemId
            },
            data: {
              name,
              price,
              description,
              imageUrl
            },
          });

          return NextResponse.json(item);
  } catch (error) {
    console.log("[ITEM_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { menuId: string; itemId: string } }
) {
  try {
    const session = await auth()
    const userId = session?.user.id;

    if (!userId) {
      return new NextResponse("Unauthenticated!", { status: 401 });
    }

    if (!params.itemId) {
      return new NextResponse("Item ID is required!", { status: 400 });
    }

    const menuByUserId = await prisma.menu.findFirst({
      where: {
        id: params.menuId,
        userId,
      },
    });

    if (!menuByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const item = await prisma.item.deleteMany({
      where: {
        id: params.itemId,
      },
    });

    return NextResponse.json(item);
  } catch (error) {
    console.log("[ITEM_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
