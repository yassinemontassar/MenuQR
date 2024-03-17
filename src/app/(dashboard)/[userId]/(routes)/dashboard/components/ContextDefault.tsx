"use client"
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
} from "@/components/ui/context-menu";
import Image from "next/image";
import logo from "@/assets/avatar.png";
import { MenuModal } from "@/components/modals/menu-modal";
import { useMenuModal } from "@/app/hooks/use-menu-modal";
import { useSession } from "next-auth/react";

export default function ContextDefault() {
  const menuModal = useMenuModal();
  const { data: session, status } = useSession();
  const role = session?.user.plan;

  return (
      <>
          <ContextMenu>
              <ContextMenuTrigger className="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-lg mb-6 select-none">
                  Cliquez avec le bouton droit ici
              </ContextMenuTrigger>
              <ContextMenuContent className="w-64">
                  <ContextMenuItem inset onSelect={menuModal.onOpen}>
                      Créez votre menu
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
              </ContextMenuContent>
          </ContextMenu>
      </>
  );
}
