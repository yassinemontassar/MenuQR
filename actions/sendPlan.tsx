"use server";
import nodemailer from 'nodemailer';
import * as z from 'zod';
import { PlanSchema } from '../schemas';

export const sendPlan = async (values: z.infer<typeof PlanSchema>) => {

  const validatedFields = PlanSchema.safeParse(values);
  if (!validatedFields.success) {
    return {error: "Invalid fields!"};
}
   const {email, d17, especes, phoneNumber, type, period} = validatedFields.data;
   
   let planDetails = ''; // Initialise une chaîne vide pour stocker les détails du plan

   // Vérifie si espece est true, puis l'ajoute aux détails du plan
   if (especes === true) {
      planDetails += `<p style="margin-bottom: 5px;"><strong>Mode de paiement :</strong> Espece</p>`;
    }
    // Vérifie si d17 est true, puis l'ajoute aux détails du plan
    if (d17 === true) {
      planDetails += `<p style="margin-bottom: 5px;"><strong>Mode de paiement :</strong> D17</p>`;
    }
   const html = `
     <div style="font-family: Arial, sans-serif; background-color: #f7f7f7; margin: 0; padding: 20px;">
       <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
         <h1 style="color: #333333; text-align: center;">Nouvelle Demande d'Achat de Plan</h1>
         <p style="color: #666666; line-height: 1.6;">Vous avez reçu une nouvelle demande d'achat de plan.</p>
         <div style="margin-top: 30px; border-top: 1px solid #dddddd; padding-top: 20px;">
           <h2 style="color: #333333; margin-bottom: 10px;">Détails du Plan :</h2>
           ${planDetails} <!-- Inclut les détails du plan générés ici -->
           <p style="margin-bottom: 5px;"><strong>Type de Plan :</strong> ${type}(${period})</p>
           <p style="margin-bottom: 5px;"><strong>Email :</strong> ${email}</p>
           <p style="margin-bottom: 5px;"><strong>Numéro de Téléphone :</strong> ${phoneNumber}</p>
         </div>
       </div>
     </div>
   `;

   const transporter = nodemailer.createTransport({
    service: 'sawthegamer70@gmail.com',
    auth: {
      user: 'sawthegamer70@gmail.com',
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  });
  const info = await transporter.sendMail({
   to: 'sawthegamer70@gmail.com',
   subject: 'Plan Request',
   html: html,
 });
 return {success: "Nous avons bien reçu vos informations. Notre équipe vous contactera sous peu pour finaliser votre commande. Merci de votre confiance !"}
};