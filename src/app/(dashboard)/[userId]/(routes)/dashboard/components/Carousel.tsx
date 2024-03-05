"use client";
import { AlertModal } from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { toast } from "@/components/ui/use-toast";
import { Category } from "@prisma/client";
import axios from "axios";
import { Trash2Icon } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { FaTrashCan } from "react-icons/fa6";

interface CategoryProps {
  data: Category[];
}
const CarouselOrientation: React.FC<CategoryProps> = ({ data }) => {
  const params = useParams();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);



  
  const onDelete = async () => {
    try {
      if (selectedCategoryId !== null) {
        console.log("Deleting category with ID:", selectedCategoryId);
      }

      setLoading(true);
      await axios.delete(`/api/${params.menuId}/categories/${selectedCategoryId}`);
      toast({
        title: "Suppression de la catégorie",
        description: "La catégorie sélectionnée a été supprimée avec succès.",
        variant: "default",
    });
    
    } catch (error) {
      toast({
        title: "Oops...",
        description:
          "Assurez-vous d'avoir d'abord supprimé tous les catégories utilisant cette affiche !!",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setOpen(false);
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

      <div className="flex flex-col items-center justify-start gap-9">
        <p className="font-semibold">Liste des Catégories</p>
        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full max-w-sm"
        >
          <CarouselContent className="-ml-1">
            {data.map((category) => (
              <CarouselItem
                key={category.id}
                className="pl-1 md:basis-1/2 lg:basis-1/3 group"
              >

                <div className="p-2">
                  <Card>
                    <CardContent className="">
                      {category.name}
                    </CardContent>
                  </Card>
                  <div className="flex items-center justify-center p-4">
                    <Button
                      disabled={loading}
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setSelectedCategoryId(category.id);
                        setOpen(true);
                      }}
                    >
                      <FaTrashCan className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className=" ml-16 sm:ml-2" />
          <CarouselNext className="mr-16 sm:mr-2" />
        </Carousel>
      </div>
    </>
  );
};

export default CarouselOrientation;
