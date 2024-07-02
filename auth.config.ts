import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Nodemailer from "next-auth/providers/nodemailer";
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

const domain = process.env.NEXT_PUBLIC_APP_URL;
export default {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
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
      sendVerificationRequest: async ({
        identifier: email,
        url,
      }) => {
        // Create a transporter for sending the email
        const { host } = new URL(url);
        // const transporter = nodemailer.createTransport({
        //   service: 'sawthegamer70@gmail.com',
        //   auth: {
        //     user: 'sawthegamer70@gmail.com',
        //     pass: process.env.EMAIL_SERVER_PASSWORD,
        //   },
        // });
        // Define the email options
        await resend.emails.send({
          from: "MenuRapide <onboarding@resend.dev>",
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
        });
      },
    }),
  ],
} satisfies NextAuthConfig;
