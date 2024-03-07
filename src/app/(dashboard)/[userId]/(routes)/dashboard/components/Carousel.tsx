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
import { Category, Item } from "@prisma/client";
import axios from "axios";
import { Trash2Icon } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { FaTrashCan } from "react-icons/fa6";

interface CategoryProps {
  data: Item[];
}
const CarouselOrientation: React.FC<CategoryProps> = ({ data }) => {
  const params = useParams();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(
    null
  );

  const onDelete = async () => {
    try {
      if (selectedItemId !== null) {
        console.log("Deleting Item with ID:", selectedItemId);
      }

      setLoading(true);
      await axios.delete(
        `/api/${params.menuId}/items/${selectedItemId}`
      );
      toast({
        title: "Suppression de l'élément",
        description: "L'élément sélectionné a été supprimé avec succès.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Oops...",
        description:
          "Assurez-vous d'avoir d'abord supprimé tous les catégories utilisant cette élément !!",
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
        <p className="font-semibold">Sous-Categories</p>

        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full max-w-sm"
        >
          <CarouselContent className="-ml-1">
            {data.map((item) => (
              <CarouselItem
                key={item.id}
                className="pl-1 md:basis-1/2 lg:basis-1/3 group"
              >
              <span className="flex items-center justify-center overflow-hidden" title={item.name}>
  <span className="truncate">{item.name}</span>
</span>
                <div className="p-2">
                  <Card>
                    <CardContent className="aspect-square rounded-xl relative overflow-hidden group">
                      {" "}
                      <Image
                        src={item.imageUrl}
                        alt="category"
                        fill
                        className="aspect-square object-cover rounded-md group-hover:scale-110 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </CardContent>
                  </Card>
                  <p className="flex items-center justify-center mt-2">
                    {item.price.toString()} DT
                  </p>
                  <div className="flex items-center justify-center p-4">
                    <Button
                      disabled={loading}
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setSelectedItemId(item.id);
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
