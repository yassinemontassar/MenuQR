import Header from "@/components/header";
import { Toaster } from "@/components/ui/toaster";
import { Metadata } from "next";


export const metadata: Metadata = {
metadataBase: new URL('https://www.menurapide.tn/'),
  title: {
    default:'Termes et conditions',
    template: '%s - MenuRapide',
  },
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
      <Toaster />
    </>
  );
}
