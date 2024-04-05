import { Menu } from "@prisma/client";
import { Input } from "./ui/input";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Loader, Trash, XIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import { toast } from "./ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

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

const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024; // 2 MB

const validateImageSize = (file: File): string | undefined => {
  if (!file) return; // No file selected, so nothing to validate

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return "La taille de l'image dépasse la limite maximale de 2 MB.";
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
  const imagePreviewUrl = initialData?.imageUrl ?? "";
  const supabase = createClientComponentClient();
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

  const onSubmit = async (values: MenuFormValues) => {
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
      values.imageUrl = logoUrl + uniqueFileName;
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
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="font-medium">Logo</FormLabel>
                    <FormControl className="mt-1">
                      <Input
                        disabled={loading}
                        accept="image/*"
                        type="file"
                        className="w-full"
                        onChange={(e) => {
                          setImage(e.target.files?.[0] || null);
                          field.onChange(e);
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
                        <XIcon
                          onClick={() => setImage(null)}
                          className="cursor-pointer text-red-600"
                        />
                      </div>
                    )}
                  </FormItem>
                )}
              />
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
