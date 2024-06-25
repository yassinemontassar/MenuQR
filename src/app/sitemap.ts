
import { MetadataRoute } from "next";
import getMenus from "../../actions/get-menus";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const menus = await getMenus();
    const productEntries: MetadataRoute.Sitemap = menus.map(({id}) => ({
        url: `https://www.menurapide.tn/website/${id}`,
        priority: 0.5,
        lastModified: new Date(),
        changeFrequency: 'daily',
       
    }))
    return [
        {
            url: `https://www.menurapide.tn`,
            priority: 1,
            lastModified: new Date(),
            changeFrequency: 'daily',
        },
        ...productEntries,
    ]
    
}