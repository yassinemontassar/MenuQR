"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, Wallet } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import * as z from "zod";
import { sendPlan } from "../../actions/sendPlan";
import { PlanSchema } from "../../schemas";
import { Checkbox } from "./ui/checkbox";
import { toast } from "./ui/use-toast";
interface PlanButtonProps {
  type: string;
  period: string;
}



export const PlanButton: React.FC<PlanButtonProps> = ({ type, period }) => {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setDialogOpen] = useState(true);
  const [isPending, startTransition] = useTransition();
  
  const form = useForm<z.infer<typeof PlanSchema>>({
    resolver: zodResolver(PlanSchema),
    defaultValues: {
      email: "",
      type: type,
      period: period,
    },
  });
  const handleCheckboxClick = (fieldName: string) => {
    const otherFieldName = fieldName === "especes" ? "d17" : "especes";
    form.setValue(otherFieldName, false); // Uncheck the other checkbox
  };

  useEffect(() => {
    if (session?.user?.email) {
      form.setValue("email", session.user.email);
      form.setValue("period", period);
    }
  }, [session, form, period]);

  const onSubmit = async (values: z.infer<typeof PlanSchema>) => {
    setLoading(true)
    try {
      startTransition(() => {
        sendPlan(values).then((data) => {
          toast({
            title: "Votre commande a été prise en compte !",
            description: data.success
          });
          setDialogOpen(false);
          setLoading(false)
        });
      });
         
    } catch (error) {
      console.error("Error sending plan:", error);
      setLoading(false)
    }
  };

  const handleChooseButtonClick = () => {
    if (!session) {
      alert("You need to be logged in to perform this action.");
    }
    setDialogOpen(true);
  };

  return (
    <>
      {session ? (
        <Dialog>
          <DialogTrigger asChild>
            <Button onClick={handleChooseButtonClick}>Choisir</Button>
          </DialogTrigger>
          {isDialogOpen && (
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="flex justify-center ">
                  <Wallet />
                </DialogTitle>
                <DialogDescription className="text-center p-2">
                  Entrez vos informations
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
                        {/* <FormLabel>Email</FormLabel> */}
                        <FormControl>
                          <Input
                            placeholder="email adress"
                            type="hidden"
                            {...field}
                          />
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
                    <Label>Mode de paiement</Label>
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
                    {loading ? "Envoi en cours..." : "Envoyer"}
              {loading && (
                <Loader size={20} className="text-background animate-spin" />
              )}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          )}
        </Dialog>
      ) : null}
    </>
  );
};
