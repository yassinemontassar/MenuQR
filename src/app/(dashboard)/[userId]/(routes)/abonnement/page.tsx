
import prisma from "@/app/lib/db";
import { redirect } from "next/navigation";
import { PlanColumn } from "./components/columns";
import {format} from "date-fns";
import { PlanClient } from "./components/client";

interface AbonnementPageProps {
    params: {
        userId: string;
    }
};

const AbonnementPage: React.FC<AbonnementPageProps> = async ({
params
}) => {

    const user = await prisma.user.findFirst({
        where: {
            id: params.userId,
        },
    }); 
    
    if (!user) {
        redirect("/");
    }

    const plans = await prisma.planHistory.findMany({
        where: {
            userId: params.userId
        }, 

        orderBy: {
            createdAt: 'desc'
        } 
    });

    const formattedPlans: PlanColumn[] = plans.map((item) => ({
        id: item.id, 
        name: item.name,
        createdAt: format(item.createdAt, "MMM do, yyyy"),
        expirePlan: format(item.expirePlan, "MMM do, yyyy")
    }));

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 pt-6">
            <PlanClient data={formattedPlans} />
            </div>
        </div>
    );
}
export default AbonnementPage;