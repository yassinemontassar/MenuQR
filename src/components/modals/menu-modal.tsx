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
import { Modal } from "@/components/ui/modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { useMenuModal } from "@/app/hooks/use-menu-modal";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import axios from "axios";
import Image from "next/image";
import { useParams } from "next/navigation";
import { MenuCreateSchema } from "../../../schemas";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { ToastAction } from "../ui/toast";
import UnsplashDialog from "../ui/unsplashDialog";
import { toast } from "../ui/use-toast";

export const MenuModal = () => {
  const supabase = createClientComponentClient();
  const params = useParams();
  const [image, setImage] = useState<File | null>(null);
  const MenuModal = useMenuModal();
  const [loading, setLoading] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState("");
  const [uploadOption, setUploadOption] = useState<"desktop" | "unsplash">(
    "desktop"
  );
  const form = useForm<z.infer<typeof MenuCreateSchema>>({
    resolver: zodResolver(MenuCreateSchema),
    defaultValues: {
      name: "",
      type: "",
      startTime: "",
      endTime: "",
      imageUrl: "",
    },
  });
  const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024 * 0.14648; // 300 KB

  const validateImageSize = (file: File): string | undefined => {
    if (!file) return; // No file selected, so nothing to validate

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return "La taille de l'image dépasse la limite maximale de 300 KB.";
    }

    return undefined; // No errors
  };

  const onSubmit = async (values: z.infer<typeof MenuCreateSchema>) => {
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
  useEffect(() => {
    // Update imageUrl in the form state whenever selectedImageUrl changes
    if (selectedImageUrl) {
      form.setValue("imageUrl", selectedImageUrl); // Assuming form uses yup or zod
    }
  }, [selectedImageUrl, form]);

  const handleImageSelect = (imageUrl: string) => {
    setSelectedImageUrl(imageUrl);
  };
  const handleOptionChange = (option: "desktop" | "unsplash") => {
    setUploadOption(option);
    // Clear the image state when changing the upload option
    setImage(null);
    setSelectedImageUrl("");
    form.setValue("imageUrl", "");
  };

  return (
    <Modal
      title="Création de Menu"
      description="Remplissez les informations ci-dessous"
      isOpen={MenuModal.isOpen}
      onClose={MenuModal.onClose}
    >
        <div className="space-y-4 py-2 pb-4 ">
          <Form {...form} >
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
                      <FormLabel className="">Heure d&apos;ouverture</FormLabel>
                      <FormControl>
                        <Input disabled={loading} type="time" {...field} />
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
                        <Input disabled={loading} type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Separator className="my-4 bg-foreground" />
              <FormLabel className="flex items-center justify-center p-3 font-medium ">
                Choisissez une méthode pour sélectionner une image
              </FormLabel>
              <div className="flex items-center justify-center p-3 gap-4 ">
                <input
                  type="radio"
                  id="desktop"
                  value="desktop"
                  className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2 "
                  checked={uploadOption === "desktop"}
                  onChange={() => handleOptionChange("desktop")}
                />
                <Label htmlFor="desktop">Bureau</Label>
                <input
                  type="radio"
                  id="unsplash"
                  value="unsplash"
                  className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2 "
                  checked={uploadOption === "unsplash"}
                  onChange={() => handleOptionChange("unsplash")}
                />

                <Label htmlFor="unsplash">En ligne</Label>
              </div>
              {uploadOption === "desktop" && (
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                          accept="image/jpeg, image/png" 
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
              )}
                {uploadOption === "unsplash" && (
                 <>
                 <UnsplashDialog onImageSelect={handleImageSelect} />
                 <FormField
                   control={form.control}
                   name="imageUrl"
                   render={({ field }) => (
                     <FormItem hidden>
                       <FormControl>
                         <Input
                           disabled={loading}
                           {...field}
                           onChange={(e) => {
                             field.onChange(e);
                           }}
                         />
                       </FormControl>
                       <FormMessage />
                     </FormItem>
                   )}
                 />
                 {selectedImageUrl && (
                   <div className="flex items-center justify-center gap-2 mt-2">
                     <Image
                       src={selectedImageUrl}
                       alt="aperçu"
                       width={50}
                       height={50}
                       className="object-cover w-20 h-20 rounded-md border border-gray-300"
                     />
       
                   </div>
                 )}
               </>
             )}
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
    </Modal>

  );
};
