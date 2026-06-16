import { z } from "zod";

export const signUpSchema = z.object({
  name: z.string().trim().min(2, "Le nom doit contenir au moins 2 caracteres."),
  email: z.string().trim().email("Adresse email invalide.").toLowerCase(),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caracteres."),
});

export const signInSchema = z.object({
  email: z.string().trim().email("Adresse email invalide.").toLowerCase(),
  password: z.string().min(1, "Le mot de passe est requis."),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
