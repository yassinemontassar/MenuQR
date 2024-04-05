"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
// import { toast } from "react-hot-toast";
import axios from "axios";
import { useMenuModal } from "@/app/hooks/use-menu-modal";
import { useParams } from "next/navigation";
import Image from "next/image";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { toast } from "../ui/use-toast";
import { ToastAction } from "../ui/toast";
import { Separator } from "../ui/separator";

const formSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Le nom est requis." })
    .max(50, { message: "Le nom ne peut pas dépasser 50 caractères." }),
  type: z.string().min(1, { message: "Veuillez sélectionner un type." }),
  startTime: z
    .string()
    .min(1, { message: "Veuillez sélectionner une heure de début." }),
  endTime: z
    .string()
    .min(1, { message: "Veuillez sélectionner une heure de fin." }),
  imageUrl: z.string().min(1, { message: "Sélectionnez une image !" }),
  facebookLink: z
    .string()
    .url({ message: "Veuillez saisir une URL Facebook valide." })
    .optional(),
  instagramLink: z
    .string()
    .url({ message: "Veuillez saisir une URL Instagram valide." })
    .optional(),
});

export const MenuModal = () => {
  const supabase = createClientComponentClient();
  const params = useParams();
  const [image, setImage] = useState<File | null>(null);
  const MenuModal = useMenuModal();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "",
      startTime: "",
      endTime: "",
      imageUrl: "",
    },
  });
  const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024; // 2 MB

  const validateImageSize = (file: File): string | undefined => {
    if (!file) return; // No file selected, so nothing to validate

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return "La taille de l'image dépasse la limite maximale de 2 MB.";
    }

    return undefined; // No errors
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (image) {
      const errorr = validateImageSize(image);
      if (errorr) {
        toast({
          title: "Erreur lors de la validation de l'image",
          description: `${errorr}`,
          variant: "destructive",
        });
        return;
      }
      setLoading(true);
      const bucket = "MenuLogo";
      const subfolder = "logo";
      const folderName = params.userId; // Existing folder name
      const { crypto } = window;
      const randomString = crypto
        .getRandomValues(new Uint32Array(1))[0]
        .toString(36)
        .padStart(10, "0");
      const uniqueFileName = `${randomString}.${image.name.split(".").pop()}`;
      const filePath = `${folderName}/${subfolder}/${uniqueFileName}`;

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, image, { upsert: true });

      if (error) {
        alert("Error uploading file.");
        return;
      }

      values.imageUrl = uniqueFileName;
    }
    try {
      setLoading(true);
      // values.imageUrl= params.userId+"logo"
      const body = { ...values };
      const response = await axios.post("/api/menus", body);
      window.location.assign(`menu/${response.data.id}`);
    } catch (error) {
      toast({
        title: "Oups ! Quelque chose s'est mal passé.",
        description: "Il y a eu un problème avec votre demande.",
        action: <ToastAction altText="Réessayer">Réessayer</ToastAction>,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Création de Menu"
      description="Remplissez les informations ci-dessous"
      isOpen={MenuModal.isOpen}
      onClose={MenuModal.onClose}
    >
      <div>
        <div className="space-y-4 py-2 pb-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Nom de votre Restaurant/Caffe"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Choisissez votre type</FormLabel>
                    <FormControl>
                      <Select
                        disabled={loading}
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="">
                          <SelectValue
                            defaultValue={field.value}
                            placeholder="Type"
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Restaurant">Restaurant</SelectItem>
                          <SelectItem value="Cafe">Café</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Separator className="my-4 bg-foreground" />
              <div className="flex items-center justify-evenly p-2 gap-2">
                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="">Heure d ouverture</FormLabel>
                      <FormControl>
                        <Select
                          disabled={loading}
                          onValueChange={field.onChange}
                          value={field.value}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="">
                            <SelectValue
                              defaultValue={field.value}
                              placeholder="l'heure de début"
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="00:00">00:00</SelectItem>
                            <SelectItem value="01:00">01:00</SelectItem>
                            <SelectItem value="02:00">02:00</SelectItem>
                            <SelectItem value="03:00">03:00</SelectItem>
                            <SelectItem value="04:00">04:00</SelectItem>
                            <SelectItem value="05:00">05:00</SelectItem>
                            <SelectItem value="06:00">06:00</SelectItem>
                            <SelectItem value="07:00">07:00</SelectItem>
                            <SelectItem value="08:00">08:00</SelectItem>
                            <SelectItem value="09:00">09:00</SelectItem>
                            <SelectItem value="10:00">10:00</SelectItem>
                            <SelectItem value="11:00">11:00</SelectItem>
                            <SelectItem value="12:00">12:00</SelectItem>
                            <SelectItem value="13:00">13:00</SelectItem>
                            <SelectItem value="14:00">14:00</SelectItem>
                            <SelectItem value="15:00">15:00</SelectItem>
                            <SelectItem value="16:00">16:00</SelectItem>
                            <SelectItem value="17:00">17:00</SelectItem>
                            <SelectItem value="18:00">18:00</SelectItem>
                            <SelectItem value="19:00">19:00</SelectItem>
                            <SelectItem value="20:00">20:00</SelectItem>
                            <SelectItem value="21:00">21:00</SelectItem>
                            <SelectItem value="22:00">22:00</SelectItem>
                            <SelectItem value="23:00">23:00</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="">Heure de fermeture</FormLabel>
                      <FormControl>
                        <Select
                          disabled={loading}
                          onValueChange={field.onChange}
                          value={field.value}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="">
                            <SelectValue
                              defaultValue={field.value}
                              placeholder="l'heure de fermeture"
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="00:00">00:00</SelectItem>
                            <SelectItem value="01:00">01:00</SelectItem>
                            <SelectItem value="02:00">02:00</SelectItem>
                            <SelectItem value="03:00">03:00</SelectItem>
                            <SelectItem value="04:00">04:00</SelectItem>
                            <SelectItem value="05:00">05:00</SelectItem>
                            <SelectItem value="06:00">06:00</SelectItem>
                            <SelectItem value="07:00">07:00</SelectItem>
                            <SelectItem value="08:00">08:00</SelectItem>
                            <SelectItem value="09:00">09:00</SelectItem>
                            <SelectItem value="10:00">10:00</SelectItem>
                            <SelectItem value="11:00">11:00</SelectItem>
                            <SelectItem value="12:00">12:00</SelectItem>
                            <SelectItem value="13:00">13:00</SelectItem>
                            <SelectItem value="14:00">14:00</SelectItem>
                            <SelectItem value="15:00">15:00</SelectItem>
                            <SelectItem value="16:00">16:00</SelectItem>
                            <SelectItem value="17:00">17:00</SelectItem>
                            <SelectItem value="18:00">18:00</SelectItem>
                            <SelectItem value="19:00">19:00</SelectItem>
                            <SelectItem value="20:00">20:00</SelectItem>
                            <SelectItem value="21:00">21:00</SelectItem>
                            <SelectItem value="22:00">22:00</SelectItem>
                            <SelectItem value="23:00">23:00</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Separator className="my-4 bg-foreground" />
              <FormField
                control={form.control}
                name="facebookLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Page Facebook (optionnel)</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="https://www.facebook.com/"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="instagramLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Page Instagram (optionnel)</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="https://www.instagram.com/"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Separator className="my-4 bg-foreground" />
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Logo</FormLabel>
                    <FormControl>
                      <Input
                        accept="image/*"
                        type="file"
                        disabled={loading}
                        onChange={(e) => {
                          setImage(e.target.files?.[0] || null);
                          field.onChange(e);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                    {image && (
                      <div className="flex items-center justify-center gap-2">
                        <Image
                          src={URL.createObjectURL(image)}
                          alt="aperçu"
                          width={50}
                          height={50}
                          className="object-cover w-20 h-20 rounded-md"
                        />
                        {/* <XIcon 
                          onClick={() => setImage(null)}
                          className="cursor-pointer text-red-600"
                        /> */}
                      </div>
                    )}
                  </FormItem>
                )}
              />
              <div className="pt-6 space-x-2 flex items-center justify-center w-full">
                <Button
                  disabled={loading}
                  variant="outline"
                  onClick={MenuModal.onClose}
                >
                  Annuler
                </Button>
                <Button disabled={loading} type="submit">
                  Continuer
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Modal>
  );
};
