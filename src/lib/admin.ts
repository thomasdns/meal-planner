import "server-only";

import { notFound } from "next/navigation";

import { requireUser } from "@/lib/session";

export function isAdminEmail(email?: string | null) {
  if (!email) {
    return false;
  }

  const adminEmails =
    process.env.ADMIN_EMAILS?.split(",")
      .map((item) => item.trim().toLowerCase())
      .filter(Boolean) ?? [];

  return adminEmails.includes(email.toLowerCase());
}

export async function requireAdmin() {
  const user = await requireUser();

  if (!isAdminEmail(user.email)) {
    notFound();
  }

  return user;
}
