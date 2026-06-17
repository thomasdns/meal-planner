"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

import { signUpSchema } from "@/features/auth/auth.validation";
import {
  createEmailVerificationLink,
} from "@/features/auth/email-verification.actions";
import { sendEmailVerificationEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";

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

  const rateLimit = checkRateLimit(`sign-up:${parsed.data.email}`, {
    limit: 5,
    windowMs: 60 * 60 * 1000,
  });

  if (!rateLimit.allowed) {
    return {
      error: "Trop de tentatives. Reessaie plus tard.",
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

  const user = await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      password: hashedPassword,
    },
    select: {
      email: true,
    },
  });

  const verificationLink = await createEmailVerificationLink(user.email);
  const emailResult = await sendEmailVerificationEmail(
    user.email,
    verificationLink,
  );

  if (!emailResult.delivered) {
    return {
      error:
        "Compte cree, mais l'email de verification n'a pas pu etre envoye.",
    };
  }

  redirect("/auth/sign-in?registered=1");
}
