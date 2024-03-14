import prisma from "@/app/lib/db";

const getMenuLength = async (userId: string): Promise<number> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { menus: { select: { _count: true } } },
    });

    if (!user || !user.menus) {
      throw new Error("User not found or has no menus");
    }
    const totalMenus = user.menus.reduce(
      (sum, menu) => sum + menu._count.user,
      0
    );
    return totalMenus;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default getMenuLength;
