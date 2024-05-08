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