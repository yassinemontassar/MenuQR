import prisma from "@/app/lib/db";
import { authOptions } from "@/app/utils/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, type, imageUrl } = body;
    const session = await getServerSession(authOptions)
    const userId = session?.user.id
    if (!userId) {
        return new NextResponse("Unauthorized", {status: 401});
    }

    if (!name) {
        return new NextResponse("Name is required", {status: 400});
    }

    const menu = await prisma.menu.create({
        data: {
            userId,
            name,
            type,
            imageUrl: process.env.NEXT_PUBLIC_IMAGE_BASE_URL+"/"+userId+"/logo/"+imageUrl
        }
    });
    return NextResponse.json(menu);
  } catch (error) {
    console.log("[MENUS_POST", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
