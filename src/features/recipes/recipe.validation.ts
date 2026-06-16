import { z } from "zod";

export const createRecipeSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Le titre doit contenir au moins 2 caracteres.")
    .max(120, "Le titre ne doit pas depasser 120 caracteres."),
  description: z
    .string()
    .trim()
    .max(500, "La description ne doit pas depasser 500 caracteres.")
    .optional()
    .transform((value) => (value ? value : undefined)),
  servings: z.coerce
    .number()
    .int("Le nombre de portions doit etre un entier.")
    .min(1, "Il faut au moins 1 portion.")
    .max(20, "Le nombre de portions ne doit pas depasser 20."),
});

export type CreateRecipeInput = z.infer<typeof createRecipeSchema>;
