"use client"
import { useMenuModal } from "@/app/hooks/use-menu-modal";
import { MenuModal } from "@/components/modals/menu-modal";
import {
    ContextMenu,
    ContextMenuCheckboxItem,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuLabel,
    ContextMenuRadioGroup,
    ContextMenuRadioItem,
    ContextMenuSeparator,
    ContextMenuShortcut,
    ContextMenuSub,
    ContextMenuSubContent,
    ContextMenuSubTrigger,
    ContextMenuTrigger,
  } from "@/components/ui/context-menu"

  import  {Menu}  from "@prisma/client";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import logo from "@/assets/avatar.png"

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

    // Transformez les données des menus pour les adapter à l'interface utilisateur.
    const formattedItems = items.map((item) => ({
        name: item.name,
        userId: item.userId,
        type: item.type,
        imageUrl: item.imageUrl,
        MenuId: item.id
    }));

    // Filtrer les menus actuels en fonction de l'utilisateur.
    const currenStore = formattedItems.filter((item) => item.userId == params.userId);

    // Gérez la sélection d'un menu.
    const handleSelect = (menuId: string) => {
        // Effectuez toute action nécessaire en fonction du menu sélectionné.
        // Par exemple, naviguez vers une nouvelle page en fonction du menuId.
        router.push(`menu/${menuId}`);
    }

    return (
        <>
            {/* Mappez chaque menu dans un composant ContextMenu. */}
            {currenStore.map((menu) => (
                <ContextMenu key={menu.MenuId}>
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
                                className="rounded-md object-cover group-hover:brightness-110 transition duration-300 ease-in-out"
                            />
                        </div>
                        {/* Affichez un message au survol du menu. */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center opacity-0 group-hover:opacity-100 transition duration-300 ease-in-out">
                            <p className="text-xl font-semibold">Clic droit sur moi</p>
                        </div>
                    </ContextMenuTrigger>

                    {/* Contenu du menu contextuel. */}
                    <ContextMenuContent className="w-64">
                        {/* Élément du menu pour éditer le type du menu. */}
                        <ContextMenuItem key={menu.MenuId} inset onSelect={() => handleSelect(menu.MenuId)}>
                            Éditer votre {menu.type}
                            {/* Utilisez un raccourci avec l'image du logo. */}
                            <ContextMenuShortcut>
                                <Image
                                    src="/logo.png"
                                    alt="logo"
                                    width={25}
                                    height={25}
                                    className="rounded-full"
                                />
                            </ContextMenuShortcut>
                        </ContextMenuItem>

                        {/* Éléments supplémentaires du menu. */}
                        <ContextMenuItem inset>
                            Retour
                            <ContextMenuShortcut>⌘[</ContextMenuShortcut>
                        </ContextMenuItem>
                        <ContextMenuItem inset disabled>
                            Avant
                            <ContextMenuShortcut>⌘]</ContextMenuShortcut>
                        </ContextMenuItem>
                        <ContextMenuItem inset>
                            Recharger
                            <ContextMenuShortcut>⌘R</ContextMenuShortcut>
                        </ContextMenuItem>

                        {/* Sous-menu "Plus d'outils". */}
                        <ContextMenuSub>
                            <ContextMenuSubTrigger inset>Plus doutils</ContextMenuSubTrigger>
                            <ContextMenuSubContent className="w-48">
                                <ContextMenuItem>
                                    Enregistrer la page sous...
                                    <ContextMenuShortcut>⇧⌘S</ContextMenuShortcut>
                                </ContextMenuItem>
                                <ContextMenuItem>Créer un raccourci...</ContextMenuItem>
                                <ContextMenuItem>Nommer la fenêtre...</ContextMenuItem>
                                <ContextMenuSeparator />
                                <ContextMenuItem>Outils de développement</ContextMenuItem>
                            </ContextMenuSubContent>
                        </ContextMenuSub>

                        {/* Séparateur du menu. */}
                        <ContextMenuSeparator />

                        {/* Éléments de case à cocher du menu. */}
                        <ContextMenuCheckboxItem checked>
                            Afficher la barre de favoris
                            <ContextMenuShortcut>⌘⇧B</ContextMenuShortcut>
                        </ContextMenuCheckboxItem>
                        <ContextMenuCheckboxItem>Afficher les URL complètes</ContextMenuCheckboxItem>

                        {/* Séparateur du menu. */}
                        <ContextMenuSeparator />

                        {/* Groupe d'options radio du menu. */}
                        <ContextMenuRadioGroup value="pedro">
                            <ContextMenuLabel inset>Personnes</ContextMenuLabel>
                            <ContextMenuSeparator />
                            <ContextMenuRadioItem value="pedro">
                                Pedro Duarte
                            </ContextMenuRadioItem>
                            <ContextMenuRadioItem value="colm">Colm Tuite</ContextMenuRadioItem>
                        </ContextMenuRadioGroup>
                    </ContextMenuContent>
                </ContextMenu>
            ))}
        </>
    );
}