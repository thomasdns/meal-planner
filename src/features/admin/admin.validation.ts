import { z } from "zod";

import { userRoles } from "@/lib/roles";

export const updateAdminUserSchema = z.object({
  name: z
    .string()
    .trim()
    .max(80, "Le nom ne doit pas depasser 80 caracteres.")
    .optional()
    .transform((value) => (value ? value : undefined)),
  email: z.string().trim().email("Adresse email invalide.").toLowerCase(),
  role: z.enum(userRoles),
});

export type UpdateAdminUserInput = z.infer<typeof updateAdminUserSchema>;
