
import StatsCard from "../componenets/stats";
import getMenu from "../../../../../actions/get-menu";
import prisma from "@/app/lib/db";
import ShowAll from "../componenets/ShowAll";
import { notFound } from "next/navigation";

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
  });
  return (
    <div>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row gap-8">
          <div className="w-full sm:w-3/4">
            <StatsCard data={menu} />
            <ShowAll data={categories} />
          </div>
        </div>
      </main>
    </div>
  );
};
export default WebSite;
