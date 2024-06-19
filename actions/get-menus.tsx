import { Menu } from "@prisma/client";

const URL = `${process.env.NEXT_PUBLIC_BASE_URL}/api/menus`;

const getMenus = async (): Promise<Menu[]> => {
  try {
    // Create a new Headers object and set the 'x-secret-key'
    const headers = new Headers({
      "x-secret-key": process.env.MY_SECRET_KEY || "", // Provide a default empty string if MY_SECRET_KEY is undefined
    });

    const res = await fetch(URL, {
      method: "GET",
      headers: headers, // Pass the Headers object
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }
    return res.json();
  } catch (error) {
    console.error("error fetching menus", error);
    return [];
  }
};

export default getMenus;
