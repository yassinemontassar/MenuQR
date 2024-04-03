
import prisma from "@/app/lib/db";
import { SettingsForm } from "./components/settings-form";
import { redirect } from "next/navigation";
interface SettingsPageProps {
    params: {
        userId: string;
    }
};

const SettingsPage: React.FC<SettingsPageProps> = async ({
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

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 pt-6">
            <SettingsForm initialData={user} />
            </div>
        </div>
    );
}
export default SettingsPage;