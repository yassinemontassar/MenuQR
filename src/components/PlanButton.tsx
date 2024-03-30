"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { Checkbox } from "./ui/checkbox";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
interface PlanButtonProps {
  type: string 
}

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Le nom est requis." })
    .max(50, { message: "Le nom ne peut pas dépasser 50 caractères." }),

});

export const  PlanButton: React.FC<PlanButtonProps> = ({ type }) => {
    const { data: session, status } = useSession()
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        email: "",
      },
    });
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Choisir</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Pay with Vercel</DialogTitle>
          <DialogDescription>Enter your payment information.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" placeholder="Enter your email" type="email" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" placeholder="Enter your phone" type="tel" />
          </div>
          <div className="space-y-2">
            <Label>Payment method</Label>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="card" name="method" />
                <Label className="text-sm font-normal line-through" htmlFor="card">
                  Credit card
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="paypal" name="method" />
                <Label className="text-sm font-normal" htmlFor="paypal">
                  PayPal
                </Label>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Pay</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}