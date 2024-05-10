import { PrismaAdapter } from "@auth/prisma-adapter";
import { UserPlan, UserRole } from "@prisma/client";
import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Nodemailer from "next-auth/providers/nodemailer";
import nodemailer from 'nodemailer';
import prisma from "../lib/db";

export const { handlers: {GET, POST}, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  cookies: {
    pkceCodeVerifier: {
      name: "pkceCodeVerifier",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: true,
      },
    },
  },
  session: {
    strategy: 'jwt'
  },
//   pages: {
// error: '/nam',
// signIn : "/wiw",
// newUser: "/jdid"
//   },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      allowDangerousEmailAccountLinking: true
    }),
    GitHubProvider({
        clientId: process.env.GITHUB_ID as string,
        clientSecret: process.env.GITHUB_SECRET as string,
         allowDangerousEmailAccountLinking: true,
    }),
    Nodemailer({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
      sendVerificationRequest: async ({ identifier: email, url, token, provider }) => {
        // Create a transporter for sending the email
        const {host} = new URL(url)
        const transporter = nodemailer.createTransport({
          service: 'sawthegamer70@gmail.com',
          auth: {
            user: 'sawthegamer70@gmail.com',
            pass: process.env.EMAIL_SERVER_PASSWORD,
          },
        });
        // Define the email options
        const emailOptions = {
          from: process.env.EMAIL_FROM,
          to: email,
          subject: `Bienvenue sur ${host} - Vérification de l'adresse e-mail 🚀`,
          text: "Veuillez cliquer sur le lien ci-dessous pour confirmer votre adresse e-mail :",
          html: `
            <div style="text-align: center; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #2c3e50; color: #ecf0f1; padding: 40px;">
              <h2 style="color: #3498db;">Bienvenue sur ${host} !</h2>
              <p style="color: #bdc3c7; font-size: 16px;">Pour commencer, cliquez sur le bouton ci-dessous pour vérifier votre adresse e-mail :</p>
              <a href="${url}" style="display: inline-block; background-color: #3498db; color: #fff; text-decoration: none; padding: 15px 30px; border-radius: 8px; cursor: pointer; margin-top: 25px; font-size: 18px;">Vérifier l'e-mail</a>
              <p style="color: #bdc3c7; font-size: 14px; margin-top: 20px;">Merci de rejoindre ${host} ! 🚀</p>
            </div>
          `,
        };



        await transporter.sendMail(emailOptions);
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
       const slugify = require('slugify')
       if (account?.provider === 'email') {
         const username = slugify(user.email?.split("@")[0], { lower: true })
         user.name = username
       }


      const userExist = await prisma.user.count({
        where: {
          email: user.email
        }
      })
      if ( userExist) { 
        return true
      } else {

        return true
      }
    },


    async session({ session, token }) {
      if (token  ) {
        session.user.id = token.id,
        session.user.plan = token.plan as UserPlan;
        session.user.role = token.role  as UserRole;
      }
      return session;
    },
    async jwt({token, user}) {
      const dbUser =  await prisma.user.findFirst({
        where: {
          email: token.email
        },
      })
      if (!dbUser) {
        token.id = user!.id 
        return token
      }
      return {
        id: dbUser.id,
        name: dbUser.name,
        plan: dbUser.plan,
        role: dbUser.role,
        email: dbUser.email,
        picture: dbUser.image
      }
    }
  }

}
) ;
