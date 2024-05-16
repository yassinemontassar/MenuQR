"use client";
import deleteImage from "@/app/utils/DeleteImage";
import getRandom from "@/app/utils/RandomStringGenerator";
import uploadImage from "@/app/utils/UploadImage";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
import UnsplashDialog from "@/components/ui/unsplashDialog";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Item } from "@prisma/client";
import axios from "axios";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
  const [selectedImageUrl, setSelectedImageUrl] = useState("");
  const [uploadOption, setUploadOption] = useState<"desktop" | "unsplash">(
    "desktop"
  );
  const [image, setImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>(
    item.imageUrl ?? ""
  );
  const logoUrl =
    process.env.NEXT_PUBLIC_IMAGE_BASE_URL + "/" + params.userId + "/items/";
  const [loading, setLoading] = useState(false);
  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

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
      await uploadImage(bucket, filePath, image);
      values.imageUrl = logoUrl + uniqueFileName;
      // Remove an existing image
      const imageUrl = item.imageUrl;
      const extractedPath = imageUrl
        .split("/storage/v1/object/public/MenuLogo")[1]
        .slice(1);
      await deleteImage(bucket, extractedPath);
    }

    try {
      setLoading(true);
      const body = {
        ...values,
      };
      await axios.patch(`/api/${params.menuId}/items/${item.id}`, body);
      router.push(`?modified=${getRandom(1)}`);
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
  // Callback function to be called when an image is selected in UnsplashDialog
  useEffect(() => {
    // Update imageUrl in the form state whenever selectedImageUrl changes
    if (selectedImageUrl) {
      form.setValue("imageUrl", selectedImageUrl); // Assuming form uses yup or zod
    }
  }, [selectedImageUrl, form]);

  const handleImageSelect = (imageUrl: string) => {
    setSelectedImageUrl(imageUrl);
    setImagePreviewUrl(imageUrl);
  };
  const handleOptionChange = (option: "desktop" | "unsplash") => {
    setUploadOption(option);
    // Clear the image state when changing the upload option
    setImage(null);
    setImagePreviewUrl(item.imageUrl ?? "");
    setSelectedImageUrl("");
    form.setValue("imageUrl", item.imageUrl ?? "");
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
                          if (
                            selectedFile &&
                            (selectedFile.type === "image/jpeg" ||
                              selectedFile.type === "image/png")
                          ) {
                            // Updated condition to check for JPEG or PNG
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
