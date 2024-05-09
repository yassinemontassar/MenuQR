import prisma from "@/app/lib/db";
import { auth } from "@/app/utils/auth";
import { MenuModal } from "@/components/modals/menu-modal";
import { Button } from "@/components/ui/button";
import { Crown } from "lucide-react";
import Context from "./components/Context";
import ContextDefault from "./components/ContextDefault";

interface DashboardPageProps {
  params: {
    userId: string;
  };
}

const DashboardPage: React.FC<DashboardPageProps> = async ({ params }) => {
  const session = await auth()
  const plan = session?.user.plan;
  const menus = await prisma.menu.findMany({
    where: {
      userId: params.userId,
    },
  });
  return (
    <div className="flex flex-col sm:flex-row">
      <div className="flex-1 p-6 sm:min-w-0 sm:flex-1 mt-20">
        <h1 className="text-2xl font-bold mb-4 flex items-center justify-between">
          <span className="text-foreground text-base font-medium">
            {plan === "Gratuit"
              ? `(${menus.length} sur 1 menu disponible)`
              : plan === "Pro"
              ? `(${menus.length} sur 5 menus disponibles)`
              : plan === "Standard"
              ? `(${menus.length} sur 2 menus disponibles)`
              : "(Aucun menu actif)"}
            {(plan === "Gratuit" ||
              (plan === "Standard" && menus.length >= 2)) && (
              <Button className="h-8 transition-transform duration-200 ease-in-out hover:scale-95  sm:ml-2">
                Passer à Pro
                <Crown className="ml-1 text-yellow-500" />
              </Button>
            )}
          </span>
        </h1>
        <div className="flex flex-col sm:flex-row sm:space-x-4">
        {(plan === "Pro" || (plan === "Standard" && menus.length<2 )) && <ContextDefault />}{" "}
          {/* Only show ContextDefault for Pro users */}
          {plan === "Gratuit" && menus.length == 0 && <ContextDefault />}{" "}
          {/* Show ContextDefault for Free users with 0 menus */}
          <Context items={menus} />
          <MenuModal />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
