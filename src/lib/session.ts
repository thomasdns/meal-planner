import "server-only";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { cache } from "react";

import { authOptions } from "@/lib/auth";

export const requireUser = cache(async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/sign-in");
  }

  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    role: session.user.role,
  };
});
