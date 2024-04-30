"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";

export default function SigninWithGoogle() {
  return (
    <>
      <div className="flex flex-col items-center justify-center space-y-4">
        <Button
          onClick={() =>
            signIn("google", { callbackUrl: process.env.AUTH_URL })
          }
          className="mt-1"
          variant="secondary"
        >
          Continuez avec Google
          <FcGoogle className="w-4 h-4 ml-2" />
        </Button>
        <div>
          <p className="text-center text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            En créant un compte
            <div> vous confirmez avoir lu et compris notre</div>
            <Link
              href="https://www.menurapide.tn/terms"
              target="_blank"
              className="text-blue-600 underline"
            >
              {" "}
              Politique de Confidentialité
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
