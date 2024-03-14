import Context from "./components/Context";
import prisma from "@/app/lib/db";
import ContextDefault from "./components/ContextDefault";
import { MenuModal } from "@/components/modals/menu-modal";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/utils/auth";
import { Button } from "@/components/ui/button";
import { Crown } from "lucide-react";

interface DashboardPageProps {
    params: {
        userId: string;
    }
};

const DashboardPage: React.FC<DashboardPageProps> = async ({
    params
}) => { 
    const session = await getServerSession(authOptions);
    const plan = session?.user.plan;
    const menus = await prisma.menu.findMany({
        where: {
            userId: params.userId,
        },
    });
    
    
    return (
        <div className="flex flex-col sm:flex-row">
            <div className="flex-1 p-6 sm:min-w-0 sm:flex-1">
                <h1 className="text-2xl font-bold mb-4 flex items-center justify-between">
                    <span className="text-foreground text-base font-medium">
                        {plan === 'Free'
                            ? `(${menus.length} sur 1 menu disponible)`
                            : plan === 'Pro'
                            ? `(${menus.length} sur 5 menus disponibles)`
                            : '(Aucun menu actif)'}
                        {plan === 'Free' && (
                            <Button className="h-8 transition-transform duration-200 ease-in-out hover:scale-95  sm:ml-2">
                                Passer à Pro
                                <Crown className="ml-1 text-yellow-500" />
                            </Button>
                        )}
                    </span>
                </h1>
                <div className="flex flex-col sm:flex-row sm:space-x-4">
                {plan === 'Pro' && <ContextDefault />} {/* Only show ContextDefault for Pro users */}
                {plan === 'Free' && menus.length == 0 && <ContextDefault />} {/* Show ContextDefault for Free users with 0 menus */}
                    <Context items={menus} />
                    <MenuModal />
                </div>
            </div>
        </div>
    );
}

export default DashboardPage;
