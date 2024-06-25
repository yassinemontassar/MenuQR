"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { editUser } from "../../../../../../../actions/editUser";

interface SettingsFormProps {
  initialData: User;
}

const formSchema = z.object({
  name: z.string().min(1),
  id: z.string().min(1),
});

type SettingsFormValues = z.infer<typeof formSchema>;

export const SettingsForm: React.FC<SettingsFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const defaultValues: SettingsFormValues = {
    ...initialData,
    name: initialData.name ?? "",
  };

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: SettingsFormValues) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("id", data.id);
      formData.append("name", data.name);
      await editUser(formData);
      toast({
        title: "Modification réussie !",
        description: "Votre nom d'utilisateur a été modifié avec succès.",
      });
     router.refresh();
    } catch (error) {
      return toast({
        title: "Erreur de modification !",
        description:
          "Une erreur est survenue lors de la modification de votre nom d'utilisateur. Veuillez réessayer plus tard.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 p-6 "
        >
          <div className="grind grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="hidden" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input
                      className="w-auto"
                      disabled={loading}
                      placeholder="Nom du boutique"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            Enregistrer
          </Button>
        </form>
      </Form>
    </>
  );
};
