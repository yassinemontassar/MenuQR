"use server";
import nodemailer from 'nodemailer';
export const sendPlan = async (formData: FormData) => {
   console.log(formData)
//    const transporter = nodemailer.createTransport({
//     service: 'sawthegamer70@gmail.com',
//     auth: {
//       user: 'sawthegamer70@gmail.com',
//       pass: process.env.GMAIL_PASSWORD,
//     },
//   });
};