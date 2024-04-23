import { Menu } from "@prisma/client";

const URL = `${process.env.NEXT_PUBLIC_BASE_URL}/api/menus`;

const getMenus = async () : Promise<Menu[]> => {
    try {
        const res = await fetch(URL, {
            next: { revalidate: 60 },
          });

        if (!res.ok) {
            throw new Error('Failed to fetch data');
        }
        return res.json();

    } catch (error) {
       console.error('error fetching menus', error);
       return [];
        
    }
};

export default getMenus;