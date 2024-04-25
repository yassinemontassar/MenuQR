"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";

export default function SigninWithGoogle() {
  return (
    <>
      <div className="flex flex-col items-center space-y-3">
        <Button
          onClick={() =>
            signIn("google", {
              callbackUrl: `${window.location.origin}`,
            })
          }
          className="mt-1"
          variant="secondary"
        >
          Google
          <FcGoogle className="w-4 h-4 ml-4" />
        </Button>
        <div className="space-x-2">
          <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            En créant un compte, vous confirmez avoir lu et compris notre
            <Link href="https://www.menurapide.tn/terms" target="_blank" className="text-blue-600 underline">
              {" "} Politique de Confidentialité
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
