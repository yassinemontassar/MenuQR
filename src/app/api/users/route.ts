import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function GET(req: Request) {
  // const secretKey = req.headers.get("x-secret-key");
  // if (secretKey !== process.env.MY_SECRET_KEY) {
  //   return new NextResponse("Unauthorized", { status: 401 });
  // }
  try {
    // Get the current date and subtract 24 hours to set the comparison date
    const comparisonDate = new Date();
    comparisonDate.setHours(comparisonDate.getHours() - 24);

    // Find all users
    const users = await prisma.user.findMany();

    // Calculate the new users count
    const newUsersCount = users.filter(
      (user) => new Date(user.createdAt) > comparisonDate
    ).length;

    // Return the total users, new users count, and the list of users
    return NextResponse.json(
      {
        totalUsers: users.length,
        newUsers: newUsersCount,
        usersList: users, // Include the full list of users
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.log("[USERS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
