"use client"
import { Input } from "./ui/input";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {  useEffect, useState } from "react";
import { Label } from "./ui/label";
import { Loader2, Trash, XIcon } from "lucide-react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import Image from "next/image";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import CarouselOrientation from "@/app/(dashboard)/[userId]/(routes)/dashboard/components/Carousel";


const formSchema = z.object({
  name: z.string().min(1),
  imageUrl: z.string().min(1),
});

interface Category {
  id: string;
  MenuId: string;
  name: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}
type CattegoryFormValues = z.infer<typeof formSchema>;

export const ComponenetB: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [shouldFetch, setShouldFetch] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const form = useForm<CattegoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
    },
  });
  const [isFetchingCategories, setIsFetchingCategories] = useState(false);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsFetchingCategories(true); 
        const response = await axios.get(`/api/${params.menuId}/categories`);
        setCategories(response.data as Category[]);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsFetchingCategories(false);
      }
    };
    fetchCategories();
    setShouldFetch(false)
  }, [shouldFetch, params.menuId]);



  const [newCategoryName, setNewCategoryName] = useState("");
  const [newImage, setNewImage] = useState("");
  const [isNewCategoryInputVisible, setIsNewCategoryInputVisible] =
    useState(false);

  const handleAddNewCategory = () => {
    setIsNewCategoryInputVisible(true);
  };

  const handleSaveNewCategory = () => {
    console.log("New Category Name:", newCategoryName);
    // Add logic to update your state or perform any other necessary actions
    //setIsNewCategoryInputVisible(false);
  };
  const onSubmit = async (values: CattegoryFormValues) => {
    if (image) {
      setLoading(true);
      const bucket = "MenuLogo";
      const subfolder = "categories"
      const folderName = params.userId; // Existing folder name
      const { crypto } = window;
      const randomString = crypto.getRandomValues(new Uint32Array(1))[0].toString(36).padStart(10, '0');
      const uniqueFileName = `${randomString}.${image.name.split('.').pop()}`;
      const filePath = `${folderName}/${subfolder}/${uniqueFileName}`;
  
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, image, { upsert: true });
  
      if (error) {
        alert('Error uploading file.');
        return;
      }
      values.imageUrl = uniqueFileName
    }
    try {
      setLoading(true);
      const body = { ...values };
      console.log(body)
      await axios.post(`/api/${params.menuId}/categories`, body);
      router.refresh();
    } catch (error) {
      // toast.error("Something went wrong!");
    } finally {
       setLoading(false);
       setShouldFetch(true)
    }
  };
  return (
    <div>
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
        <CarouselOrientation data={categories} />
      )}
      <div className="flex items-center justify-center p-16">
        <Button onClick={handleAddNewCategory}>Ajouter une nouvelle catégorie</Button>
      </div>
      {isNewCategoryInputVisible && (
        <div className="p-8 rounded-lg shadow-lg ring-1">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">Nom</FormLabel>
                    <FormControl className="mt-1">
                      <Input
                        disabled={loading}
                        placeholder="Nom de votre catégorie"
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
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">Logo de la catégorie</FormLabel>
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
                <Button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2"
                >
                  {loading ? 'Enregistrement en cours...' : 'Enregistrer'}
                  {loading && <Loader2 size={20} className="text-background animate-spin" />}
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
