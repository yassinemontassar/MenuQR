"use client";
import { Input } from "./ui/input";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { useParams } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import {  FaTrashCanArrowUp } from "react-icons/fa6";
import { FaRegEdit } from "react-icons/fa";
import { AlertModal } from "@/components/modals/alert-modal";
import { toast } from "./ui/use-toast";
import { useSession } from "next-auth/react";

const formSchema = z.object({
  name: z.string().min(1, { message: "Le nom de la catégorie est requis." }),
});


interface Category {
  id: string;
  MenuId: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
type CattegoryFormValues = z.infer<typeof formSchema>;

export const ComponenetB: React.FC = () => {
  const { data: session } = useSession()
  const plan = session?.user.plan
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [shouldFetch, setShouldFetch] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryInputs, setCategoryInputs] = useState<{ [key: string]: string }>({});
  const form = useForm<CattegoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
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
    setShouldFetch(false);
  }, [shouldFetch, params.menuId]);

  const handleInputChange = (categoryId: string, value: string) => {
    setCategoryInputs((prevInputs) => ({
      ...prevInputs,
      [categoryId]: value,
    }));
  };

  const [isNewCategoryInputVisible, setIsNewCategoryInputVisible] =
    useState(false);

  const handleAddNewCategory = () => {
    setIsNewCategoryInputVisible(true);
  };

  const onSubmit = async (values: CattegoryFormValues) => {
    if (plan=="Gratuit" && categories.length>=3) {
      toast({
        title: "Erreur",
        description: "Vous ne pouvez pas ajouter plus de 3 catégories avec le plan gratuit",
        variant: "destructive",
      });
      return;
    }
    try {
      setLoading(true);
      const body = { ...values };
      console.log(body);
      await axios.post(`/api/${params.menuId}/categories`, body);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Oops, quelque chose s'est mal passé. Veuillez réessayer.",
        variant: "destructive",
      });
      
    } finally {
      toast({
        title: "Ajout de la catégorie",
        description: `La nouvelle catégorie ${values.name} a été ajoutée avec succès.`,
        variant: "default",
      });
      
      setLoading(false);
      setShouldFetch(true);
      form.reset();
      setIsNewCategoryInputVisible(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(
        `/api/${params.menuId}/categories/${selectedCategoryId}`
      );
      toast({
        title: "Suppression de la catégorie",
        description: "La catégorie sélectionnée a été supprimée avec succès.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Oops...",
        description:
          "Assurez-vous d'avoir d'abord supprimé tous les elements utilisant cette catégorie !!",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setOpen(false);
      setShouldFetch(true);
    }
  };

  const updateCategory = async (categoryId: string) => {
    const newName = categoryInputs[categoryId];
    if (!newName || newName.trim() === '') {
      toast({
        title: "Erreur",
        description: "Le nom de la catégorie ne peut pas être vide.",
        variant: "destructive",
      });
      return;
    }
    try {
      setLoading(true);
      const payload = { name: newName };
      await axios.patch(`/api/${params.menuId}/categories/${categoryId}`, payload );
      toast({
        title: "Modification de la catégorie",
        description: "La catégorie sélectionnée a été modifiée  avec succès.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Oops...",
        description: 
          "Une erreur s'est produite lors de la modification de la catégorie.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setOpen(false);
      setShouldFetch(true);
    }
  };


  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div>
      <p className="flex items-center justify-center font-semibold">Liste des Categories</p>
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
          <>
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-center p-3 gap-3"
              >
                <Input key={category.id} defaultValue={category.name} 
                 onChange={(e) => handleInputChange(category.id, e.target.value)}
                />
                <Button
                  disabled={loading}
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    setSelectedCategoryId(category.id);
                    setOpen(true);
                  }}
                >
                  <FaTrashCanArrowUp className="h-5 w-4" />
                </Button>
                <Button
                  disabled={loading}
                  variant="secondary"
                  size="sm"
                  onClick={() => updateCategory(category.id)} 
                >
                  <FaRegEdit   className="h-5 w-4" />
                </Button>
              </div>
            ))}
          </>
        )}
        <div className="flex items-center justify-center p-16">
          <Button onClick={handleAddNewCategory}>
            Ajouter une nouvelle catégorie
          </Button>
        </div>
        {isNewCategoryInputVisible && (
          <div className="p-8 rounded-lg shadow-lg ring-1">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
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
                <div className="flex justify-center space-x-4 pt-6">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2"
                  >
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
    </>
  );
};
