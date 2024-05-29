"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import SignInEmail from "./SignInEmail";
import SigninWithGoogle from "./SignInWithGoogle";
import { Button } from "./ui/button";
import logo from "/public/logo.svg";
export default function SignInForm() {


  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" className="text-xs">Connexion</Button>
     
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] flex flex-col items-center rounded-lg ">
        <DialogHeader className="flex flex-col items-center">
          <DialogTitle>
            <Image
              src={logo}
              alt="avatar"
              className="rounded-full"
            />
          </DialogTitle>
          <DialogDescription>
            <h2 className="mt-5 text-center text-2xl font-bold leading-9 tracking-tight ">
              {" "}
            Connectez-vous à votre compte
            </h2>
          </DialogDescription>
        </DialogHeader>
        <SignInEmail />
        <div className="flex justify-between items-center w-full">
  <div className="w-full h-px bg-gray-400"></div>
  <div className="flex flex-none">
  <p className="px-4 text-center">Ou</p>
  </div>
  <div className="w-full h-px bg-gray-400"></div>
</div>
        <div className="flex flex-none space-x-4">
        <SigninWithGoogle />
        </div>
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
