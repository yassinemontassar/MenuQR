import { Menu } from "@prisma/client";
import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";

type Data = {
  result: Menu[];
};

export async function GET(req: Request, res: NextResponse<Data>) {
  const result = await prisma.menu.findMany({
    where: {
      name: "cron",
    },
  });

  await Promise.all(
    result.map(async (menu) => {
      await prisma.menu.update({
        where: {
          id: menu.id,
        },
        data: {
          name: "yes",
        },
      });
    })
  );

  return NextResponse.json(result);
}
