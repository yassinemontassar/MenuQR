"use server";
import nodemailer from 'nodemailer';
export const sendPlan = async (formData: FormData) => {

   const email = formData.get('email');
   const d17 = formData.get('d17');
   const espece = formData.get('especes');
   const phone = formData.get('phoneNumber');
   const type = formData.get('type');
   const period = formData.get('period');
   
   let planDetails = ''; // Initialise une chaîne vide pour stocker les détails du plan

   // Vérifie si espece est true, puis l'ajoute aux détails du plan
   if (espece === 'true') {
      planDetails += `<p style="margin-bottom: 5px;"><strong>Mode de paiement :</strong> Espece</p>`;
    }
    // Vérifie si d17 est true, puis l'ajoute aux détails du plan
    if (d17 === 'true') {
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
           <p style="margin-bottom: 5px;"><strong>Numéro de Téléphone :</strong> ${phone}</p>
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
};