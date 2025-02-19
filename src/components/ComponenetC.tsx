"use client";
import CarouselOrientation from "@/app/(dashboard)/[userId]/(routes)/dashboard/components/Carousel";
import getRandom from "@/app/utils/RandomStringGenerator";
import uploadImage from "@/app/utils/UploadImage";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { Item } from "@prisma/client";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import UnsplashDialog from "./ui/unsplashDialog";
import { toast } from "./ui/use-toast";

const formSchema = z.object({
  name: z.string().min(1, { message: "Le nom est requis." }),
  imageUrl: z.string().min(1, { message: "Sélectionnez une image !" }),
  description: z
    .string()
    .min(0, { message: "Description est requis." })
    .optional(),
  price: z.coerce
    .number()
    .min(1, { message: "Le prix doit être d'au moins 1." }),
  discount: z.coerce
    .number()
    .min(0, { message: "La remise doit être d'au moins 0." }),
  categoryId: z
    .string()
    .min(1, { message: "L'identifiant de catégorie est requis." }),
  isArchived: z.boolean().default(false).optional(),
});

type ItemFormValues = z.infer<typeof formSchema>;

export const ComponenetC: React.FC = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const modified = searchParams.get("modified");
  const { data: session } = useSession();
  const plan = session?.user.plan;
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [shouldFetch, setShouldFetch] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedImageUrl, setSelectedImageUrl] = useState("");
  const [uploadOption, setUploadOption] = useState<"desktop" | "unsplash">(
    "desktop"
  );

  const form = useForm<ItemFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
      price: 0,
      categoryId: "",
      isArchived: false,
      discount: 0,
    },
  });
  const [isFetchingCategories, setIsFetchingCategories] = useState(false);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsFetchingCategories(true);
        const response = await axios.get(`/api/${params.menuId}/categories`);
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsFetchingCategories(false);
      }
    };

    fetchCategories();
    setShouldFetch(false);
  }, [shouldFetch, params.menuId, modified]);

  const [isNewCategoryInputVisible, setIsNewCategoryInputVisible] =
    useState(false);

  const handleAddNewCategory = () => {
    setIsNewCategoryInputVisible(true);
  };

  const MAX_FOOD_IMAGE_SIZE_BYTES = 4 * 1024 * 1024; // 4 MB
  const validateImageSize = (file: File): string | undefined => {
    if (!file) return; // No file selected, so nothing to validate

    if (file.size > MAX_FOOD_IMAGE_SIZE_BYTES) {
      return "La taille de l'image dépasse la limite maximale de 4 MB.";
    }

    return undefined; // No errors
  };

  const onSubmit = async (values: ItemFormValues) => {
    // Count items in selected category
    const selectedCategoryItems = categories.find(
      (category) => category.id === values.categoryId
    )?.Items;
    const itemsCount = selectedCategoryItems ? selectedCategoryItems.length : 0;
    if (
      (plan === "Gratuit" && itemsCount >= 10) ||
      (plan === "Standard" && itemsCount >= 15)
    ) {
      const errorMessage =
        plan === "Gratuit"
          ? "Vous ne pouvez pas ajouter plus de 10 sous-catégorie avec le plan gratuit"
          : "Vous ne pouvez pas ajouter plus de 15 sous-catégorie avec le plan Standard";
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
      return;
    }
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
      const fileName =
        process.env.NEXT_PUBLIC_IMAGE_BASE_URL +
        "/" +
        folderName +
        "/items/" +
        uniqueFileName;
      values.imageUrl = fileName;
    }
    try {
      setLoading(true);
      const body = { ...values };
      console.log(body);
      await axios.post(`/api/${params.menuId}/items`, body);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Oops, quelque chose s'est mal passé. Veuillez réessayer.",
        variant: "destructive",
      });
      setLoading(false);
      setIsNewCategoryInputVisible(false);
    } finally {
      toast({
        title: "Élément ajouté",
        description: `L'élément ${values.name} a été ajouté à la catégorie avec succès.`,
        variant: "default",
      });

      setLoading(false);
      setShouldFetch(true);
      form.reset();
      setImage(null);
      setIsNewCategoryInputVisible(false);
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
    <div>
      <div className="flex flex-col items-center  gap-9">
        <p className="font-semibold">Sous-Categories</p>
        <select
          id="categories"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="block  p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500"
        >
          <option value="all">Toutes les catégories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {isFetchingCategories ? ( // Conditionally render loading indicator
        <div className="flex items-center justify-center p-16">
          <Loader2 size={40} className="text-primary animate-spin" />
          <p className="text-gray-500 ml-4">Chargement des catégories...</p>
        </div>
      ) : categories.length === 0 ? (
        // If no categories, display an empty state message
        <div className="flex items-center justify-center p-16">
          <p className="text-gray-500">Aucune élément trouvée</p>
        </div>
      ) : (
        <CarouselOrientation
          data={
            selectedCategory === "all"
              ? categories.flatMap((category) => category.Items) // Show all items if "all" is selected
              : selectedCategory
              ? categories.flatMap((category) =>
                  category.Items.filter(
                    (item: Item) => item.categoryId === selectedCategory
                  )
                )
              : categories.flatMap((category) => category.Items) // Default: show all items initially
          }
        />
      )}
      <div className="flex items-center justify-center p-16">
        <Button onClick={handleAddNewCategory}>
          Ajouter un nouvel élément
        </Button>
      </div>
      {isNewCategoryInputVisible && (
        <div className="p-8 rounded-lg shadow-lg ring-1">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categorie</FormLabel>
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
                            placeholder="Sélectionnez une cat&eacute;gorie"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">
                      Nom de l&apos;élément :
                    </FormLabel>
                    <FormControl className="mt-1">
                      <Input
                        disabled={loading}
                        placeholder="Nom de votre élément"
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
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">
                      Description de l&apos;élément(optionnel) :
                    </FormLabel>
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
                    <FormItem>
                      <FormLabel className="font-medium">Image :</FormLabel>
                      <FormControl className="mt-1">
                        <Input
                          accept="image/*"
                          type="file"
                          disabled={loading}
                          className="w-full px-3 py-2 placeholder-gray-500 border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          onChange={(e) => {
                            setImage(e.target.files?.[0] || null);
                            field.onChange(e);
                          }}
                        />
                      </FormControl>
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
                      <FormMessage />
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
              <div className="flex justify-center space-x-4 pt-6">
                <Button type="submit" disabled={loading} className="px-4 py-2">
                  {loading ? "Enregistrement en cours..." : "Enregistrer"}
                  {loading && (
                    <Loader2
                      size={20}
                      className="text-background animate-spin"
                    />
                  )}
                </Button>
                <Button
                  disabled={loading}
                  variant="destructive"
                  onClick={() => setIsNewCategoryInputVisible(false)}
                  className="px-4 py-2"
                >
                  Annuler
                </Button>
              </div>
            </form>
          </Form>
        </div>
      )}
    </div>
  );
};
