import { z } from "zod";

export const updateAdminUserSchema = z.object({
  name: z
    .string()
    .trim()
    .max(80, "Le nom ne doit pas depasser 80 caracteres.")
    .optional()
    .transform((value) => (value ? value : undefined)),
  email: z.string().trim().email("Adresse email invalide.").toLowerCase(),
});

export type UpdateAdminUserInput = z.infer<typeof updateAdminUserSchema>;
