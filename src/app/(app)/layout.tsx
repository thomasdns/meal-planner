import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { isAdminRole } from "@/lib/admin";
import { authOptions } from "@/lib/auth";

export default async function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/sign-in");
  }

  return (
    <AppShell showAdminNav={isAdminRole(session.user.role)}>
      {children}
    </AppShell>
  );
}
