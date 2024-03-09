"use client";
import { Input } from "./ui/input";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Label } from "./ui/label";
import { Loader2, Trash, XIcon } from "lucide-react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import CarouselOrientation from "@/app/(dashboard)/[userId]/(routes)/dashboard/components/Carousel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category, Item } from "@prisma/client";
import Image from "next/image";
import { toast } from "./ui/use-toast";

const formSchema = z.object({
  name: z.string().min(1),
  imageUrl: z.string().min(1),
  price: z.coerce.number().min(1),
  discount: z.coerce.number().min(0),
  categoryId: z.string().min(1),
  isArchived: z.boolean().default(false).optional(),
});

type ItemFormValues = z.infer<typeof formSchema>;

export const ComponenetC: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [shouldFetch, setShouldFetch] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");

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
  }, [shouldFetch, params.menuId]);

  const [isNewCategoryInputVisible, setIsNewCategoryInputVisible] =
    useState(false);

  const handleAddNewCategory = () => {
    setIsNewCategoryInputVisible(true);
  };

  const onSubmit = async (values: ItemFormValues) => {
    if (image) {
      setLoading(true);
      const bucket = "MenuLogo";
      const subfolder = "items";
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
      await axios.post(`/api/${params.menuId}/items`, body);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Oops, quelque chose s'est mal passé. Veuillez réessayer.",
        variant: "destructive",
      });
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
    }
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
          <p className="text-gray-500">Aucune catégorie trouvée</p>
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
                        placeholder="Nom de votre plat"
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
