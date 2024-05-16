"use client";
import deleteImage from "@/app/utils/DeleteImage";
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
import Currency from "@/components/ui/currency";
import { toast } from "@/components/ui/use-toast";
import { Item } from "@prisma/client";
import axios from "axios";
import { Settings } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { FaTrashCan } from "react-icons/fa6";
import ElementModal from "./ElementModal";

interface CategoryProps {
  data: Item[];
}
const CarouselOrientation: React.FC<CategoryProps> = ({ data }) => {
  const params = useParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [selectedItemImg, setSelectedItemImg] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const handleButtonClick = (item: Item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null); // Reset selectedItem when modal is closed
  };
  
  const onDelete = async () => {
    try {
      setLoading(true);
      if (selectedItemImg && selectedItemImg.includes('/storage/v1/object/public/MenuLogo')) {
        const extractedPath = selectedItemImg.split('/storage/v1/object/public/MenuLogo')[1].slice(1);
        await deleteImage("MenuLogo", extractedPath);
      }
      await axios.delete(`/api/${params.menuId}/items/${selectedItemId}`);
      router.push(`?modified=${selectedItemId}`)
      toast({
        title: "Suppression de l'élément",
        description: "L'élément sélectionné a été supprimé avec succès.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Oops...",
        description:
          "Erreur occured!",
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

      <div className="flex flex-col items-center justify-start gap-9 mt-9">


        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-xs"
        >
          <CarouselContent className="ml-1 gap-1">
  {data.map((item) => (
    <CarouselItem
      key={item.id}
      className="pl-1 md:basis-1/2 lg:basis-1/2 group border-2 border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      <div
        className="flex items-center justify-center overflow-hidden p-3"
        title={item.name}
      >
        <span className="text-lg truncate text-center">{item.name}</span>
      </div>
      <div className="p-2">
        <Card>
          <CardContent className="aspect-square rounded-xl relative overflow-hidden group">
            <Image
              src={item.imageUrl}
              alt="category"
              fill
              placeholder="blur"
              blurDataURL="data:image/webp;base64,UklGRgIDAABXRUJQVlA4WAoAAAAgAAAAowAAowAASUNDUMgBAAAAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADZWUDggFAEAAFANAJ0BKqQApAA+7XawVamnJCMgSYkwHYlpbt1eIivgBQTRJBl7y0CpJfFdwPK8Dm/jQKIiWqD/2BnORvrgxrY5EoR4Yg+oq7dcm83ECqnLAunixQg9P7OJzMt086nh205kNKXZ89y+V+WzIAyrfeuTq+AA/ulrVS6/ccGKnqhlMjCCrWJkp2JSF75ecL5rm4UKwPXFaCCSFNKa3csikWUK94YtcAk4NaINmLnBHfN3ZRfOfAxm6zGMC0NZljgbH9RvNGoqMr6Htk2l9yAcm5XDAEAwQaMyqZYOhwdyxuZqW+1dsVglVmbKOQkSK5yv3o4l+ZMkyGslzr/q3k5GSR9/J3plC04lYb0EG6uYzTEfCAAAAA=="
              className="aspect-square object-cover rounded-md group-hover:scale-110 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </CardContent>
        </Card>
        <div className="flex items-center justify-center mt-2">
          <Currency value={item.price.toString()} />
        </div>
        <div className="flex items-center justify-center p-4 gap-2">
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => {
              setSelectedItemId(item.id);
              setSelectedItemImg(item.imageUrl)
              setOpen(true);
            }}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            <FaTrashCan className="h-4 w-4" />
          </Button>
          <Button
            disabled={loading}
            variant="secondary"
            size="sm"
            onClick={() => handleButtonClick(item)}
          >
            <Settings className="h-4 w-4" />
          </Button>
          {selectedItem && (
  <ElementModal isOpen={isModalOpen} onClose={handleCloseModal} item={selectedItem} />
)}

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
