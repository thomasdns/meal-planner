import "server-only";

import { notFound } from "next/navigation";

import { requireUser } from "@/lib/session";
import { UserRole, type UserRole as UserRoleType } from "@/lib/roles";

export function isAdminRole(role?: UserRoleType | null) {
  return role === UserRole.ADMIN;
}

export async function requireAdmin() {
  const user = await requireUser();

  if (!isAdminRole(user.role)) {
    notFound();
  }

  return user;
}
