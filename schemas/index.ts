import * as z from "zod";

export const PlanSchema = z.object({
    email: z
      .string()
      .email({ message: "Please enter a valid email address." })
      .optional(),
    type: z.string(),
    period: z.string(),
    d17: z.boolean(),
    especes: z.boolean(),
    phoneNumber: z
      .string()
      .regex(/^[0-9\-\+\s\.]*$/, { message: "Invalid phone number format." }),
  });

  export const MenuCreateSchema = z.object({
    name: z
      .string()
      .min(1, { message: "Le nom est requis." })
      .max(50, { message: "Le nom ne peut pas dépasser 50 caractères." }),
    type: z.string().min(1, { message: "Veuillez sélectionner un type." }),
    startTime: z
      .string()
      .min(1, { message: "Veuillez sélectionner une heure de début." }),
    endTime: z
      .string()
      .min(1, { message: "Veuillez sélectionner une heure de fin." }),
    imageUrl: z.string().min(1, { message: "Sélectionnez une image !" }),
    facebookLink: z
      .string()
      .url({ message: "Veuillez saisir une URL Facebook valide." })
      .optional(),
    instagramLink: z
      .string()
      .url({ message: "Veuillez saisir une URL Instagram valide." })
      .optional(),
  });
  