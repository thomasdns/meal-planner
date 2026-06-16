"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

import { signUpSchema } from "@/features/auth/auth.validation";
import { prisma } from "@/lib/prisma";

export type SignUpState = {
  error?: string;
};

export async function signUpAction(
  _previousState: SignUpState,
  formData: FormData,
): Promise<SignUpState> {
  const parsed = signUpSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Donnees invalides.",
    };
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email: parsed.data.email,
    },
  });

  if (existingUser) {
    return {
      error: "Un compte existe deja avec cette adresse email.",
    };
  }

  const hashedPassword = await bcrypt.hash(parsed.data.password, 12);

  await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      password: hashedPassword,
    },
  });

  redirect("/auth/sign-in");
}
