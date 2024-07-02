import { PrismaAdapter } from "@auth/prisma-adapter";
import { UserPlan, UserRole } from "@prisma/client";
import NextAuth from "next-auth";
import authConfig from "../../../auth.config";
import prisma from "../lib/db";

export const {
  handlers: { GET, POST },
  signIn,
  signOut,
  auth,
} = NextAuth({
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      const slugify = require("slugify");
      if (account?.provider === "email") {
        const username = slugify(user.email?.split("@")[0], { lower: true });
        user.name = username;
      }

      const userExist = await prisma.user.count({
        where: {
          email: user.email,
        },
      });
      if (userExist) {
        return true;
      } else {
        return true;
      }
    },

    async session({ session, token }) {
      if (token) {
        (session.user.id = token.id),
          (session.user.plan = token.plan as UserPlan);
        session.user.role = token.role as UserRole;
      }
      return session;
    },
    async jwt({ token, user }) {
      const dbUser = await prisma.user.findFirst({
        where: {
          email: token.email,
        },
      });
      if (!dbUser) {
        token.id = user!.id;
        return token;
      }
      return {
        id: dbUser.id,
        name: dbUser.name,
        plan: dbUser.plan,
        role: dbUser.role,
        email: dbUser.email,
        picture: dbUser.image,
      };
    },
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
});
