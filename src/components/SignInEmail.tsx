"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { signIn } from "next-auth/react";
import { useState } from "react";
import FormSubmitButton from "./FormSubmitButton";

export default function SignInEmail() {
  const [email, setEmail] = useState<null | string>(null);
  async function SignInWithEmail() {
    try {
      if (email) {
        const signInResult = await signIn("email", {
          email: email,
          callbackUrl: `${window.location.origin}`,
          redirect: false,

        });
        console.log(signInResult)
        if (signInResult?.error) {
          return toast({
            title: "Well this did not work...",
            description: "Something went wrong, please try again",
            variant: "destructive",
          });
        }


        if (!signInResult?.ok) {
          return toast({
            title: "Eh bien, cela n'a pas fonctionné...",
            description: "Quelque chose s'est mal passé, veuillez réessayer",
            variant: "destructive",
          });
        }

        return toast({
          title: "Vérifiez votre e-mail",
          description: "Un lien magique vous a été envoyé",
        });
      } else {
        return toast({
          title: "E-mail invalide",
  description: "Veuillez saisir une adresse e-mail valide",
          variant: "destructive",
        });
      }
    } catch (error) {
      return toast({
        title: "Oops...",
        description: "error",
        variant: "destructive",
      });
    }
  }
  return (
    <form action={SignInWithEmail}>
      <div className="flex flex-col gap-y-2">
        <Label>Adresse e-mail</Label>
        <Input
          onChange={(e) => setEmail(e.target.value)}
          name="email"
          type="email"
          placeholder="exemple@domaine.com"
        />
      </div>
      <FormSubmitButton className="mt-4 w-full">Connectez-vous par e-mail</FormSubmitButton>
    </form>
  );
}