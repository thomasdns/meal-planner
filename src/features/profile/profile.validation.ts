import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Le nom doit contenir au moins 2 caracteres.")
    .max(80, "Le nom ne doit pas depasser 80 caracteres."),
  email: z.string().trim().email("Adresse email invalide.").toLowerCase(),
});

export const deleteAccountSchema = z.object({
  confirmation: z.literal("SUPPRIMER", {
    error: "Tape SUPPRIMER pour confirmer la suppression du compte.",
  }),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type DeleteAccountInput = z.infer<typeof deleteAccountSchema>;
