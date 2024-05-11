import prisma from "@/app/lib/db";
import { User } from "@prisma/client";
import { NextApiResponse } from "next";
import { NextResponse } from "next/server";

type Data = {
  result: User[];
};

export async function PATCH(req: Request, res: NextApiResponse<Data>) {
  const secretKey = req.headers.get("x-secret-key");
  if (secretKey !== process.env.MY_SECRET_KEY) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  const result = await prisma.menu.findMany({
    where: {
      published: true,
      user: {
        expirePlan: {
          lte: new Date(new Date().toISOString().split('T')[0] + 'T23:59:59.999Z')
        }
      },
    },
    include: {
      user: true,
    }
  });

  await Promise.all(
    result.map(async (menu) => {
      await prisma.menu.update({
        where: {
          id: menu.id,
        },
        data: {
          published: false
        },
      });
    })
    
  );
  return NextResponse.json(result);
}
