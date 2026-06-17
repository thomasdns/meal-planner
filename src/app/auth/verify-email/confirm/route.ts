import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";

import { verifyEmailToken } from "@/features/auth/email-verification.actions";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    redirect("/auth/verify-email?status=missing");
  }

  const result = await verifyEmailToken(token);

  redirect(`/auth/verify-email?status=${result.success ? "success" : "invalid"}`);
}
