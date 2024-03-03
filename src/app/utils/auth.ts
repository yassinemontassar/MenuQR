import type { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "../lib/db";
import nodemailer from 'nodemailer';

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt'
  },
//   pages: {
// error: '/nam',
// signIn : "/wiw",
// newUser: "/jdid"
//   },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      allowDangerousEmailAccountLinking: true
    }),
    GitHubProvider({
        clientId: process.env.GITHUB_ID as string,
        clientSecret: process.env.GITHUB_SECRET as string,
         allowDangerousEmailAccountLinking: true,
    }),
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
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
          subject: `Welcome to ${host} - Email Address Verification 🚀`,
          text: "Please click the link below to confirm your email address:",
          html: `
            <div style="text-align: center; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #2c3e50; color: #ecf0f1; padding: 40px;">
              <h2 style="color: #3498db;">Welcome to ${host}!</h2>
              <p style="color: #bdc3c7; font-size: 16px;">To get started, click the button below to verify your email address:</p>
              <a href="${url}" style="display: inline-block; background-color: #3498db; color: #fff; text-decoration: none; padding: 15px 30px; border-radius: 8px; cursor: pointer; margin-top: 25px; font-size: 18px;">Verify Email</a>
              <p style="color: #bdc3c7; font-size: 14px; margin-top: 20px;">Thank you for joining ${host}! 🚀</p>
            </div>
          `,
        };
        

        await transporter.sendMail(emailOptions);
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
       // Use slugify to generate a username from the email address
       const slugify = require('slugify')
       if (account?.provider === 'email') {
         const username = slugify(user.email?.split("@")[0], { lower: true })
         console.log(username)
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
        session.user.plan = token.plan
        session.user.role = token.role
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
  
} as NextAuthOptions;