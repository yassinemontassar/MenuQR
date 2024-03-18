import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function PATCH (
req: Request, 
) {
try {

    const result = await prisma.menu.updateMany({
        data: {
          name: {
            set: "a"
          }, 
        },
      });
console.log(result)
return NextResponse.json(result);


} catch (error) {
    console.log('[CRON-JOB]', error);
    return new NextResponse("Internal error", {status: 500});
    
}

};