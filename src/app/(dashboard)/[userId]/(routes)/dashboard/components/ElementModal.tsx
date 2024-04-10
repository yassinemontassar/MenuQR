"use client"
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Item } from "@prisma/client";
import axios from "axios";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useParams, useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import deleteImage from "@/app/utils/DeleteImage";
import uploadImage from "@/app/utils/UploadImage";
import getRandom from "@/app/utils/RandomStringGenerator";

const formSchema = z.object({
  name: z.string().min(1, { message: "Le nom est requis." }),
  description: z
    .string()
    .min(0, { message: "Description est requis." })
    .optional(),
  price: z.coerce
    .number()
    .min(1, { message: "Le prix doit être d'au moins 1." }),
  imageUrl: z.string().min(1, { message: "Sélectionnez une nouvelle image !" }),
});

type ElementFormValues = z.infer<typeof formSchema>;

const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024; // 2 MB

const validateImageSize = (file: File): string | undefined => {
  if (!file) return; // No file selected, so nothing to validate

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return "La taille de l'image dépasse la limite maximale de 2 MB.";
  }
  return undefined; // No errors
};

interface MyModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: Item;
}

const ElementModal: React.FC<MyModalProps> = ({ isOpen, onClose, item }) => {
  const router = useRouter();
  const params = useParams();
  const logoUrl =
  process.env.NEXT_PUBLIC_IMAGE_BASE_URL + "/" + params.userId + "/items/";
  const [loading, setLoading] = useState(false);
  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  const [image, setImage] = useState<File | null>(null);
  const defaultValues = item
    ? {
        ...item,
        price: parseFloat(String(item?.price)),
        description: item.description ?? undefined,
      }
    : {
        name: "",
        price: 0,
        description: undefined,
        imageUrl: "",
      };

  const form = useForm<ElementFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (values: ElementFormValues) => {

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
      const subfolder = "items";
      const folderName = params.userId; // Existing folder name
      const uniqueFileName = `${getRandom(2)}.${image.name.split(".").pop()}`;
      const filePath = `${folderName}/${subfolder}/${uniqueFileName}`;
// Upload a new image
 await uploadImage(bucket, filePath, image)
  values.imageUrl = logoUrl + uniqueFileName;
// Remove an existing image
const imageUrl = item.imageUrl;
const extractedPath = imageUrl.split('/storage/v1/object/public/MenuLogo')[1].slice(1);
await deleteImage(bucket,extractedPath)

    }

    try {
      setLoading(true);
      const body = {
        ...values, 
      };
      await axios.patch(`/api/${params.menuId}/items/${item.id}`, body);
      router.push(`?modified=${getRandom(1)}`)
    } catch (error) {
      // toast.error("Something went wrong!");
    } finally {
      toast({
        title: "Mis à jour",
        description: `Votre Element ${values.name} a été mis à jour avec succès. Les modifications sont prises en compte.`,
        variant: "default",
      });
      setLoading(false);
      onClose();
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={onChange}>
      <DialogContent className=" sm:max-w-[425px] rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-center">Modification</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 p-1  "
          >
            <div className="grid gap-4 py-4 ">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom</FormLabel>
                    <FormControl>
                      <Input
                        className="w-auto"
                        placeholder="Nom de votre élément"
                        disabled={loading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description(optionnel)</FormLabel>
                    <FormControl className="mt-1">
                      <textarea
                        disabled={loading}
                        placeholder="Description de votre élément"
                        className="w-full px-3 py-2 placeholder-gray-500 border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prix</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        disabled={loading}
                        placeholder="9.99"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="font-medium">Logo</FormLabel>
                    <FormControl className="mt-1">
                    <Input
    disabled={loading}
    accept="image/jpeg, image/png" // Updated accept attribute to accept JPEG and PNG
    type="file"
    className="w-full"
    onChange={(e) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile && (selectedFile.type === "image/jpeg" || selectedFile.type === "image/png")) { // Updated condition to check for JPEG or PNG
            setImage(selectedFile);
            field.onChange(e);
        } else {
            // Handle error or provide feedback to the user
           alert("Please select a JPG or PNG file.");
        }
    }}
/>


                    </FormControl>
                    <FormMessage className="text-red-600" />
                    {image && (
                      <div className="flex items-center justify-center gap-2 mt-2">
                        <Image
                          src={URL.createObjectURL(image)}
                          alt="aperçu"
                          width={50}
                          height={50}
                          className="object-cover w-20 h-20 rounded-md border border-gray-300"
                        />
                      </div>
                    )}
                  </FormItem>
                )}
              />
            </div>
            <Button disabled={loading} className="ml-auto w-full" type="submit">
              Enregistrer les modification
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
export default ElementModal;
