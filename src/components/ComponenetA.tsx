import getRandom from "@/app/utils/RandomStringGenerator";
import uploadImage from "@/app/utils/UploadImage";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Menu } from "@prisma/client";
import axios from "axios";
import { Loader, XIcon } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

import deleteImage from "@/app/utils/DeleteImage";
import UnsplashDialog from "./ui/unsplashDialog";
import { toast } from "./ui/use-toast";

const formSchema = z.object({
  name: z.string().min(1, { message: "Le nom est requis." }),
  type: z.string().min(1, { message: "Veuillez sélectionner un type." }),
  startTime: z
    .string()
    .min(1, { message: "Veuillez sélectionner une heure de début." }),
  endTime: z
    .string()
    .min(1, { message: "Veuillez sélectionner une heure de fin." }),
  imageUrl: z.string().min(1, { message: "Sélectionnez une nouvelle image !" }),
  facebookLink: z
    .string()
    .optional()
    .refine(
      (value) => {
        return value === "" || isValidUrl(value);
      },
      { message: "Veuillez saisir une URL Facebook valide." }
    ),
  instagramLink: z
    .string()
    .optional()
    .refine(
      (value) => {
        return value === "" || isValidUrl(value);
      },
      { message: "Veuillez saisir une URL Instagram valide." }
    ),
});

// Function to check if a given string is a valid URL
function isValidUrl(url: string | undefined): boolean {
  if (typeof url === "undefined") {
    return true; // Treat undefined as valid
  }
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

type MenuFormValues = z.infer<typeof formSchema>;

const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024 * 0.14648; // 300 KB

const validateImageSize = (file: File): string | undefined => {
  if (!file) return; // No file selected, so nothing to validate

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return "La taille de l'image dépasse la limite maximale de 300 KB.";
  }

  return undefined; // No errors
};

interface MenuFormProps {
  initialData: Menu | null;
}
export const ComponenetA: React.FC<MenuFormProps> = ({ initialData }) => {
  const router = useRouter();
  const params = useParams();
  const logoUrl =
    process.env.NEXT_PUBLIC_IMAGE_BASE_URL + "/" + params.userId + "/logo/";
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>(
    initialData?.imageUrl ?? ""
  );
  const defaultValues = initialData
    ? {
        ...initialData,
        facebookLink: initialData.facebookLink ?? undefined,
        instagramLink: initialData.instagramLink ?? undefined,
      }
    : {
        name: "",
        type: "",
        startTime: "",
        endTime: "",
        imageUrl: "",
        facebookLink: undefined,
        instagramLink: undefined,
      };
  const form = useForm<MenuFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  const [selectedImageUrl, setSelectedImageUrl] = useState("");
  const [uploadOption, setUploadOption] = useState<"desktop" | "unsplash">(
    "desktop"
  );

  const onSubmit = async (values: MenuFormValues) => {
    console.log(values.imageUrl);
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
      const subfolder = "logo";
      const folderName = params.userId; // Existing folder name
      const uniqueFileName = `${getRandom(2)}.${image.name.split(".").pop()}`;
      const filePath = `${folderName}/${subfolder}/${uniqueFileName}`;

      // Remove an existing image
      const pathArray = initialData?.imageUrl.split("/storage/v1/object/public/MenuLogo");
      if (pathArray && pathArray.length > 1) {
        const extractedPath = pathArray[1].slice(1);
        if (extractedPath) {
          await deleteImage("MenuLogo", extractedPath);
        }
      }
      
      // Upload a new image
      await uploadImage("MenuLogo", filePath, image);
      

      const newImageUrl = logoUrl + uniqueFileName;
      setImagePreviewUrl(newImageUrl);
      values.imageUrl = newImageUrl;

      if (initialData) {
        initialData.imageUrl = values.imageUrl;
      }
      setImagePreviewUrl(values.imageUrl);
    }
    try {
      setLoading(true);
      const body = { ...values };
      await axios.patch(`/api/menus/${params.menuId}`, body);
      router.refresh();
    } catch (error) {
      // toast.error("Something went wrong!");
    } finally {
      toast({
        title: "Menu mis à jour",
        description: `Votre menu ${values.name} a été mis à jour avec succès. Les modifications sont prises en compte.`,
        variant: "default",
      });
      setLoading(false);
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
    setImagePreviewUrl(initialData?.imageUrl ?? "");
    form.setValue("imageUrl", initialData?.imageUrl ?? "");

  };
  return (
    <>
      <p className="font-semibold">Formulaire de mise à jour du menu</p>
      <div className="bg-background   p-8 rounded-lg shadow-lg ring-1 md:p-12 mt-5 ">
        <div className="flex items-center justify-center mb-5">
          <Image
            src={imagePreviewUrl}
            alt="logo"
            placeholder="blur"
            blurDataURL="data:image/webp;base64,UklGRgIDAABXRUJQVlA4WAoAAAAgAAAAowAAowAASUNDUMgBAAAAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADZWUDggFAEAAFANAJ0BKqQApAA+7XawVamnJCMgSYkwHYlpbt1eIivgBQTRJBl7y0CpJfFdwPK8Dm/jQKIiWqD/2BnORvrgxrY5EoR4Yg+oq7dcm83ECqnLAunixQg9P7OJzMt086nh205kNKXZ89y+V+WzIAyrfeuTq+AA/ulrVS6/ccGKnqhlMjCCrWJkp2JSF75ecL5rm4UKwPXFaCCSFNKa3csikWUK94YtcAk4NaINmLnBHfN3ZRfOfAxm6zGMC0NZljgbH9RvNGoqMr6Htk2l9yAcm5XDAEAwQaMyqZYOhwdyxuZqW+1dsVglVmbKOQkSK5yv3o4l+ZMkyGslzr/q3k5GSR9/J3plC04lYb0EG6uYzTEfCAAAAA=="
            width={60}
            height={60}
            sizes="(max-width: 768px) 100vw,
              (max-width: 1200px) 50vw,
              33vw"
            className="object-cover rounded-full border border-gray-300"
          />
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="w-full max-w-md">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="font-medium">
                      Nom de votre {initialData?.type}
                    </FormLabel>
                    <FormControl className="mt-1">
                      <Input
                        className="w-full px-3 py-2 placeholder-gray-500 border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Nom"
                        disabled={loading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-600" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select
                      disabled={loading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            defaultValue={field.value}
                            placeholder="Select a category"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Restaurant">Restaurant</SelectItem>
                        <SelectItem value="Cafe">Café</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-evenly p-2 gap-2">
                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Heure d&apos;ouverture</FormLabel>
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
                      <XIcon
                        onClick={() => setImage(null)}
                        className="cursor-pointer text-red-600"
                      />
                    </div>
                  )}
                </>
              )}
              {image && (
                <div className="flex items-center justify-center gap-2 mt-2">
                  <Image
                    src={URL.createObjectURL(image)}
                    alt="aperçu"
                    width={50}
                    height={50}
                    className="object-cover w-20 h-20 rounded-md border border-gray-300"
                  />
                  <XIcon
                    onClick={() => setImage(null)}
                    className="cursor-pointer text-red-600"
                  />
                </div>
              )}
            </div>
            <Button
              className="w-full px-3 py-2"
              type="submit"
              disabled={loading}
            >
              {loading ? "Mise à jour en cours..." : "Mettre à jour"}
              {loading && (
                <Loader size={20} className="text-background animate-spin" />
              )}
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
};
