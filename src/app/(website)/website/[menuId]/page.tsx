
import prisma from "@/app/lib/db";
import { notFound } from "next/navigation";
import getMenu from "../../../../../actions/get-menu";
import ShowAll from "../componenets/ShowAll";
import StatsCard from "../componenets/stats";

const WebSite = async ({ params }: { params: { menuId: string } }) => {
  const store = await prisma.menu.findFirst({ 
    where: {
      id: params.menuId,
      published: true,
    }
   });
   if (!store) {
    return notFound(); 
  }
  const menu = await getMenu(params.menuId);
  const categories = await prisma.category.findMany({
    where: {
      MenuId: params.menuId, 
    },
    include: {
      Items: true,
    },
    orderBy: {
      createdAt: 'asc'
    }
  });
  const modifiedCategories = categories.map(category => ({
    ...category,
    Items: category.Items.map(item => ({
      ...item,
      price: item.price.toNumber() // Convert Decimal to number to resolve the plain object error
    }))
  }));
  return (
    <div>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row gap-8">
          <div className="w-full sm:w-3/4">
            <StatsCard data={menu} />
            <ShowAll data={modifiedCategories} />
          </div>
        </div>
      </main>
    </div>
  );
};
export default WebSite;
