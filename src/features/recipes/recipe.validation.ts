import { z } from "zod";

const optionalMinutesSchema = z
  .union([z.literal(""), z.coerce.number().int()])
  .optional()
  .transform((value) => (value === "" ? undefined : value))
  .pipe(
    z
      .number()
      .min(0, "Le temps ne peut pas etre negatif.")
      .max(1440, "Le temps ne doit pas depasser 24 heures.")
      .optional(),
  );

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
  prepTime: optionalMinutesSchema,
  cookTime: optionalMinutesSchema,
  steps: z
    .string()
    .trim()
    .max(3000, "Les etapes ne doivent pas depasser 3000 caracteres.")
    .optional()
    .transform((value) => (value ? value : undefined)),
  imageUrl: z
    .string()
    .trim()
    .url("L'URL de l'image est invalide.")
    .max(1000, "L'URL de l'image est trop longue.")
    .optional()
    .or(z.literal(""))
    .transform((value) => (value ? value : undefined)),
  categoryId: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value ? value : undefined)),
});

export type CreateRecipeInput = z.infer<typeof createRecipeSchema>;

export const updateRecipeSchema = createRecipeSchema;

export type UpdateRecipeInput = z.infer<typeof updateRecipeSchema>;
