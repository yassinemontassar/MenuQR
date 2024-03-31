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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
interface PlanButtonProps {
  type: string;
}

const formSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email address." })
    .optional(),
  d17: z.boolean().default(false).optional(),
  especes: z.boolean().default(true).optional(),
  phoneNumber: z
    .string()
    .regex(/^[0-9\-\+\s\.]*$/, { message: "Invalid phone number format." }),
});

export const PlanButton: React.FC<PlanButtonProps> = ({ type }) => {
  const { data: session, status } = useSession();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      d17: false,
      especes: true,
    },
  }); 
  const handleCheckboxClick = (fieldName: string) => {
    const otherFieldName = fieldName === "especes" ? "d17" : "especes";
    form.setValue(otherFieldName, false); // Uncheck the other checkbox
  };

  useEffect(() => {
    if (session?.user?.email) {
      form.setValue("email", session.user.email);
    }
  }, [session, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  const handleChooseButtonClick = () => {
    if (!session) {
      alert("You need to be logged in to perform this action.");
    }
  };

  return (
    <>
      {session ? (
        <Dialog>
          <DialogTrigger asChild>
            <Button onClick={handleChooseButtonClick}>Choisir</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-center">Pay with Vercel</DialogTitle>
              <DialogDescription>
                Enter your payment information.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="email adress" disabled {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Telephone</FormLabel>
                      <FormControl>
                        <PhoneInput
                          placeholder="numero telephone"
                          defaultCountry="TN"
                          countries={["TN"]}
                          international={true}
                          
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="space-y-2">
                  <Label>Payment method</Label>
                  <div className="flex items-center justify-center gap-4 p-3">
                    <div className="flex items-center space-x-2">
                      <FormField
                        control={form.control}
                        name="especes"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-1 space-y-0 ">
                            <FormControl>
                              <Checkbox
                                id="especes"
                                checked={field.value}
                                onCheckedChange={(value) => {
                                  field.onChange(value);
                                  handleCheckboxClick("especes");
                                }}
                              />
                            </FormControl>

                            <FormLabel>Espèce</FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <FormField
                        control={form.control}
                        name="d17"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-1 space-y-0 ">
                            <FormControl>
                              <Checkbox
                                id="d17"
                                checked={field.value}
                                onCheckedChange={(value) => {
                                  field.onChange(value);
                                  handleCheckboxClick("d17");
                                }}
                              />
                            </FormControl>

                            <FormLabel>D17</FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" className="w-full px-3 py-2">
                    Pay
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      ) : null}
    </>
  );
};
