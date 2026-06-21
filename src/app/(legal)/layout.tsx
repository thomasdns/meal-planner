import { AppHeader } from "@/components/layout/app-shell";
import { SiteFooter } from "@/components/layout/site-footer";

export default function LegalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AppHeader />
      {children}
      <SiteFooter />
    </>
  );
}
