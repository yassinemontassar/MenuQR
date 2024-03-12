import {  Menu } from "@prisma/client";



const getMenu = async (id: string): Promise<Menu> => {
  const res = await fetch(`http://localhost:3000/api/menus/${id}`, {
   cache : 'no-cache' 
  });

  return res.json();
};

export default getMenu;







