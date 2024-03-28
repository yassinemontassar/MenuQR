"use client";

import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

interface PlanButtonProps {
  type: string 
}

export const  PlanButton: React.FC<PlanButtonProps> = ({ type }) => {
    const { data: session, status } = useSession()
    console.log(type)
  return (
    <Button
    >
      Choisir
    </Button>
  );
}