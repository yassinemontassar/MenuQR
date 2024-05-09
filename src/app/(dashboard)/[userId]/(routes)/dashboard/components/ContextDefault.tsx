"use client";
import { useMenuModal } from "@/app/hooks/use-menu-modal";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { MenuSquare } from "lucide-react";
import { useSession } from "next-auth/react";
import { useMediaQuery } from "react-responsive";
export default function ContextDefault() {
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  const menuModal = useMenuModal();
  const { data: session, status } = useSession();
  const role = session?.user.plan;

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger className="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-primary/35 border-dashed hover:border-primary hover:cursor-pointer text-lg mb-6 select-none">
          {isTabletOrMobile
            ? "Appuyez et maintenez"
            : "Cliquez avec le bouton droit ici"}
        </ContextMenuTrigger>
        <ContextMenuContent className="w-64">
          <ContextMenuItem inset onSelect={menuModal.onOpen}>
            Créez votre menu
            <ContextMenuShortcut>
              <MenuSquare />
            </ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </>
  );
}
