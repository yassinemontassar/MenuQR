"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

export default function SigninWithGoogle() {
  return (
    <Button
      onClick={() =>
        signIn("google", {
          callbackUrl: `${window.location.origin}`,
        })
      }
      className="mt-1"
      variant="secondary"
    >
      Google<FcGoogle className="w-4 h-4 ml-4"/> 
    </Button>
  );
}