"use client"

import {format} from "date-fns";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuShortcut,
    ContextMenuTrigger,
  } from "@/components/ui/context-menu"
  import { useMediaQuery } from "react-responsive";
  import  {Menu}  from "@prisma/client";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {  BarChart4, Copy, Pencil } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

  interface MenuProps  {
    items: Menu[];
  }

  export default function Context({
    items = []
}: MenuProps) {
    // Utilisez le hook "useParams" pour obtenir les paramètres de l'URL.
    const params = useParams();

    // Utilisez le hook "useRouter" pour la gestion de la navigation.
    const router = useRouter();
    const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
    // Transformez les données des menus pour les adapter à l'interface utilisateur.
    const formattedItems = items.map((item) => ({
        name: item.name,
        userId: item.userId,
        type: item.type,
        imageUrl: item.imageUrl,
        MenuId: item.id,
        lastModified: format(item.updatedAt, "yyyy/MM/dd HH:mm")
    }));

    // Filtrer les menus actuels en fonction de l'utilisateur.
    const currenStore = formattedItems.filter((item) => item.userId == params.userId);

    // Gérez la sélection d'un menu.
    const handleSelect = (menuId: string) => {
        // Effectuez toute action nécessaire en fonction du menu sélectionné.
        // Par exemple, naviguez vers une nouvelle page en fonction du menuId.
        router.push(`menu/${menuId}`);
    }

    const onCopy = async (id: string) => {
        const textToCopy = `${process.env.NEXT_PUBLIC_BASE_URL}/website/${id}`;
        try {
            await navigator.clipboard.writeText(textToCopy);
            return toast({
                title: "Lien copié !",
                description: "Le lien vers le menu a été copié avec succès. Vous pouvez maintenant le partager où vous le souhaitez.",
              });
              
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };
    

    return (
        <>
            {/* Mappez chaque menu dans un composant ContextMenu. */}
           
            {currenStore.map((menu) => (
                 
                <ContextMenu key={menu.MenuId}>
                    <div>
                    <ContextMenuTrigger
                        key={menu.MenuId}
                        className="group relative flex h-[150px] w-[300px] items-center justify-center rounded-md border-2 border-dashed text-lg mb-6 transition duration-300 ease-in-out hover:border-gray-600"
                    >
                        {/* Utilisez l'image du menu en tant que logo. */}
                        <div className="flex h-full w-full">
                            <Image
                                src={menu.imageUrl}
                                alt="logo"
                                width={300}
                                height={150}
                                placeholder="blur"
                                blurDataURL="data:image/webp;base64,UklGRgIDAABXRUJQVlA4WAoAAAAgAAAAowAAowAASUNDUMgBAAAAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADZWUDggFAEAAFANAJ0BKqQApAA+7XawVamnJCMgSYkwHYlpbt1eIivgBQTRJBl7y0CpJfFdwPK8Dm/jQKIiWqD/2BnORvrgxrY5EoR4Yg+oq7dcm83ECqnLAunixQg9P7OJzMt086nh205kNKXZ89y+V+WzIAyrfeuTq+AA/ulrVS6/ccGKnqhlMjCCrWJkp2JSF75ecL5rm4UKwPXFaCCSFNKa3csikWUK94YtcAk4NaINmLnBHfN3ZRfOfAxm6zGMC0NZljgbH9RvNGoqMr6Htk2l9yAcm5XDAEAwQaMyqZYOhwdyxuZqW+1dsVglVmbKOQkSK5yv3o4l+ZMkyGslzr/q3k5GSR9/J3plC04lYb0EG6uYzTEfCAAAAA=="
                                className="rounded-md object-cover group-hover:brightness-110 transition duration-300 ease-in-out"
                            />
                        </div>
                        {/* Affichez un message au survol du menu. */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center opacity-0 group-hover:opacity-100 transition duration-300 ease-in-out">
                            <p className="text-xl font-semibold select-none"> {isTabletOrMobile
            ? "Appuyez et maintenez"
            : "Cliquez avec le bouton droit ici"}</p>
                        </div>
                    </ContextMenuTrigger>
                    {/* Contenu du menu contextuel. */}
                    <ContextMenuContent className="w-64">
                        {/* Élément du menu pour éditer le type du menu. */}
                        <ContextMenuItem key={menu.MenuId} inset onSelect={() => handleSelect(menu.MenuId)}>
                            Éditer votre {menu.type}
                            {/* Utilisez un raccourci avec l'image du logo. */}
                            <ContextMenuShortcut>
                              <Pencil size={20} />
                            </ContextMenuShortcut>
                        </ContextMenuItem>

                        {/* Éléments supplémentaires du menu. */}
                        <ContextMenuItem onClick={() => onCopy(menu.MenuId)} inset>
                        Copier le lien du menu
                            <ContextMenuShortcut><Copy size={20} /></ContextMenuShortcut>
                        </ContextMenuItem>
                        <ContextMenuItem inset disabled >
                            Statistiques(Soon)
                            <ContextMenuShortcut><BarChart4 /></ContextMenuShortcut>
                        </ContextMenuItem>
                        <ContextMenuItem inset>
                            Retour 
                            <ContextMenuShortcut>⌘R</ContextMenuShortcut>
                        </ContextMenuItem>

                     
                    </ContextMenuContent>
                    <h1 className="text-xs font-light text-center -mt-5">Dernière modification: {menu.lastModified}</h1>
                    </div>
                </ContextMenu>

            ))}
        </>
    );
}