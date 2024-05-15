import prisma from "@/app/lib/db";
import { auth } from "@/app/utils/auth";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { menuId: string } }
) {
  try {
    const session = await auth();
    const body = await req.json();

    const {
      name,
      imageUrl,
      type,
      startTime,
      endTime,
      facebookLink,
      instagramLink,
    } = body;

    const userId = session?.user.id;

    const menu = await prisma.menu.updateMany({
      where: {
        id: params.menuId,
        userId: userId,
      },
      data: {
        name,
        type,
        startTime,
        endTime,
        facebookLink,
        instagramLink,
        imageUrl,
      },
    });
    await revalidatePath(`/${userId}/menu/${params.menuId}`);

    return NextResponse.json(menu);
  } catch (error) {
    console.log("[MENU_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(1, "60 s"),
  analytics: true,
});

export async function GET(
  req: Request,
  { params }: { params: { menuId: string } }
) {
  const ip = req.headers.get("x-forwarded-for") ?? "";
  // const { success, reset } = await ratelimit.limit(ip);
  // if (!success) {
  //   const now = Date.now();
  //   const retryAfter = Math.floor((reset - now) / 1000);
  //   return new NextResponse("Too many requests", {
  //     status: 429,
  //     headers: {
  //       "retry-after": `${retryAfter}`,
  //     },
  //   });
  // }
  try {
    if (!params.menuId) {
      return new NextResponse("menuId ID is required!", { status: 400 });
    }

    const menu = await prisma.menu.findUnique({
      where: {
        id: params.menuId,
      },
      include: {
        categories: true
      }
    });
    return NextResponse.json(menu);
  } catch (error) {
    console.log("MENU_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

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
