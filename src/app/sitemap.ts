
import { MetadataRoute } from "next";
import getMenus from "../../actions/get-menus";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const menus = await getMenus();
    const productEntries: MetadataRoute.Sitemap = menus.map(({id}) => ({
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/menus/${id}`,
        priority: 0.8,
        lastModified: new Date(),
        changeFrequency: 'weekly',
       
    }))
    return [
        {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}`,
            priority: 1,
            lastModified: new Date(),
            changeFrequency: 'daily',
        },
        ...productEntries,
    ]
    
}