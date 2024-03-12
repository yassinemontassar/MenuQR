import {  Menu } from "@prisma/client";



const getMenu = async (id: string): Promise<Menu> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/menus/${id}`, {
   cache : 'no-cache' 
  });

  return res.json();
};

export default getMenu;







