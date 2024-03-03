
import { authOptions } from "@/app/utils/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import prisma from '@/app/lib/db';
import { Suspense } from "react";


interface SettingsPageProps {
    params: {
        storeId: string;
    }
};

const SettingsPage: React.FC<SettingsPageProps> = async ({
params
}) => {


    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 pt-6">
            <p>Settings</p>
            </div>
        </div>
    );
}
export default SettingsPage;