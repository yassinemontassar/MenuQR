import prisma from "@/app/lib/db";
import { auth } from "@/app/utils/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      type,
      imageUrl,
      startTime,
      endTime,
      facebookLink,
      instagramLink,
    } = body;
    const session = await auth();
    const userId = session?.user.id;
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    const menu = await prisma.menu.create({
      data: {
        userId,
        name,
        type,
        startTime,
        endTime,
        facebookLink,
        instagramLink,
        imageUrl,
      },
    });
    return NextResponse.json(menu);
  } catch (error) {
    console.log("[MENUS_POST", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(req: Request) {
  const secretKey = req.headers.get("x-secret-key");
  if (secretKey !== process.env.MY_SECRET_KEY) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  try {
    const menus = await prisma.menu.findMany();
    return NextResponse.json(menus);
  } catch (error) {
    console.log("[MENUS_GET", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
