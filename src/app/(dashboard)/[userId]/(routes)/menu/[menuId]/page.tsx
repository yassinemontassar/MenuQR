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
    if (session?.user.id !== params.userId) {
        redirect("/");
      }
      const findMenu = await prisma.menu.findUnique({
        where: {
          id: params.menuId,
          userId: params.userId,
        },
      });
      if (!findMenu) {
        redirect("/");
      }
    const menuData = await getMenu(params.menuId);

    return (
        
        <PhoneInput initialData={menuData}  />
        
    )
}

export default CategoryPage; 