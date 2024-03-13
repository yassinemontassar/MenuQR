
import StatsCard from "../componenets/stats";
import getMenu from "../../../../../actions/get-menu";
import prisma from "@/app/lib/db";
import ShowAll from "../componenets/ShowAll";

const WebSite = async ({ params }: { params: { menuId: string } }) => {
  const menu = await getMenu(params.menuId);
  const categories = await prisma.category.findMany({
    where: {
      MenuId: params.menuId, // Assuming you have `menuId` from route params
    },
    include: {
      Items: true,
    },
  });
  return (
    <div className="">
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
