import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Le nom doit contenir au moins 2 caracteres.")
    .max(80, "Le nom ne doit pas depasser 80 caracteres."),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
