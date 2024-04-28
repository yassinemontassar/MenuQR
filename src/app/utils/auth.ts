import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import authConfig from "../../../auth.config";
import prisma from "../lib/db";
export const { handlers: {GET, POST}, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt'
  },
...authConfig
}) ;