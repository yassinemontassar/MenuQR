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
    const menuData = await getMenu(params.menuId);

    return (
        <div className="py-6">
        <PhoneInput initialData={menuData}  />
        </div>
    )
}

export default CategoryPage; 