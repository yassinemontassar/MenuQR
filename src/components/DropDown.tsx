import {
  Cloud,
  CreditCard,
  Github,
  LifeBuoy,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import logo from "@/assets/avatar.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LogoutButton from "./LogoutButton";
import Link from "next/link";
import Image from "next/image";
import prisma from "@/app/lib/db";
import { auth } from "@/app/utils/auth";

export default async function DropDown() {
  const session = await auth()
  const user = await prisma.user.findFirst({
    where: {
      email: session?.user?.email,
    },
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Image
          src={session?.user?.image ?? logo}
          width={40}
          height={40}
          className="rounded-full cursor-pointer p-1 mt-1"
          alt="avatar"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <div className="flex flex-col items-center justify-center">
          <DropdownMenuLabel> {session?.user?.name}</DropdownMenuLabel>
          Plan: {session?.user?.plan}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <Link href={`/${user?.id}/dashboard`}>Tableau de bord</Link>
            <DropdownMenuShortcut>⇧⌘T</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCard className="mr-2 h-4 w-4" />
            <Link href={`/${user?.id}/abonnement`}>Abonnement</Link>
            <DropdownMenuShortcut>⌘A</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <Link href={`/${user?.id}/settings`}>Paramètres</Link>
            <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LifeBuoy className="mr-2 h-4 w-4" />
          <span>Support</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex items-center justify-center">
          <LogOut className="mr-2 h-4 w-4" />
          <LogoutButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
