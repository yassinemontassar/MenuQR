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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useEffect } from "react";
interface PlanButtonProps {
  type: string 
}

const formSchema = z.object({
  email: z
  .string()
  .email({ message: "Please enter a valid email address." })
  .optional(),
  
});

export const  PlanButton: React.FC<PlanButtonProps> = ({ type }) => {
    const { data: session, status } = useSession()
    
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        email:""
      },
    });
    useEffect(() => {
      if (session?.user?.email) {
        form.setValue('email', session.user.email);
      }
    }, [session, form]);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log(values)
    };
    console.log(type)
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Choisir</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center">Pay with Vercel</DialogTitle>
          <DialogDescription>Enter your payment information.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input  
                        placeholder="email adress"
                        disabled
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" placeholder="Enter your phone" type="tel" />
            </div>
            <div className="space-y-2">
              <Label>Payment method</Label>
              <div className="flex items-center justify-center gap-4 p-3">
                <div className="flex items-center space-x-2">
                  <Checkbox  id="espece" name="method" />
                  <Label className="text-sm font-normal" htmlFor="espece">
                    Espèce
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="D17" name="method" />
                  <Label className="text-sm font-normal" htmlFor="D17">
                    D17
                  </Label>
                </div>
                
              </div>
            </div>
          <DialogFooter>
          <Button type="submit" className="w-full px-3 py-2">Pay</Button>
        </DialogFooter>
        </form>
        </Form>
       
      </DialogContent>
    </Dialog>
  );
}