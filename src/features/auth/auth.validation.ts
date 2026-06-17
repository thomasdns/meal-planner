import { z } from "zod";

export const signUpSchema = z.object({
  name: z.string().trim().min(2, "Le nom doit contenir au moins 2 caracteres."),
  email: z.string().trim().email("Adresse email invalide.").toLowerCase(),
  password: z
    .string()
    .min(10, "Le mot de passe doit contenir au moins 10 caracteres.")
    .regex(/[A-Z]/, "Le mot de passe doit contenir une majuscule.")
    .regex(/[a-z]/, "Le mot de passe doit contenir une minuscule.")
    .regex(/[0-9]/, "Le mot de passe doit contenir un chiffre."),
});

export const signInSchema = z.object({
  email: z.string().trim().email("Adresse email invalide.").toLowerCase(),
  password: z.string().min(1, "Le mot de passe est requis."),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email("Adresse email invalide.").toLowerCase(),
});

export const resetPasswordSchema = z.object({
  token: z.string().trim().min(20, "Le lien de reinitialisation est invalide."),
  password: z
    .string()
    .min(10, "Le mot de passe doit contenir au moins 10 caracteres.")
    .regex(/[A-Z]/, "Le mot de passe doit contenir une majuscule.")
    .regex(/[a-z]/, "Le mot de passe doit contenir une minuscule.")
    .regex(/[0-9]/, "Le mot de passe doit contenir un chiffre."),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
