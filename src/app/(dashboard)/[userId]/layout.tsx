import { auth } from "@/app/utils/auth";
import Header from "@/components/header";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/providers/provider";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { userId: string };
}) {
  const session = await auth();
  if (!session || session.user.id !== params.userId) {
    redirect("/");
  }

  return (
    <>
      <Header />
      <Providers>{children}</Providers>
      <Toaster />
    </>
  );
}
