import prisma from "@/app/lib/db";
import { PhoneInput } from "@/components/phoneInput";
import { redirect } from "next/navigation";


const CategoryPage = async ({
    params
}: {
    params: {menuId: string, userId: string}
}) => {

    const menu = await prisma.menu.findUnique({
        where : {
            id: params.menuId,
            userId: params.userId
        },
        include: {
            categories: true,
        }
    });

    if (!menu) {
        redirect('/') 
    }

    return (
        <div className="py-6">
        <PhoneInput initialData={menu} initialData2={menu.categories} />
        </div>
    )
}

export default CategoryPage; 