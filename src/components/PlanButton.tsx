"use client";

import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

export default function PlanButton() {
    const { data: session, status } = useSession()
  return (
    <Button
    >
      Choisir
    </Button>
  );
}