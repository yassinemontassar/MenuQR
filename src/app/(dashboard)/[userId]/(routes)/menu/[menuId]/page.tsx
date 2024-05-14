import prisma from "@/app/lib/db";
import { auth } from "@/app/utils/auth";
import { PhoneInput } from "@/components/phoneInput";
import { redirect } from "next/navigation";
import getMenu from "../../../../../../../actions/get-menu";


const CategoryPage = async ({
    params
}: {
    params: {menuId: string, userId: string}
}) => {
    const session = await auth()
    const menu = await prisma.menu.findUnique({
        where: {
            id: params.menuId,
            userId: session?.user.id
        },
        include: {
            categories: true,
        }
    })
    

    if (!menu) {
        redirect('/') 
    }
    const menuData = await getMenu(params.menuId);

    return (
        <div className="py-6">
        <PhoneInput initialData={menuData}  />
        </div>
    )
}

export default CategoryPage; 