"use client"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Category } from "@prisma/client";
import Image from "next/image";

interface CategoryProps {
    data: Category[];
  }
  const CarouselOrientation: React.FC<CategoryProps> = ({ data }) => {
    return (
      <>
        <div className="flex flex-col items-center justify-start">
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
                  <div className="p-1">
                    <Card>
                      <CardContent className="aspect-square rounded-xl relative overflow-hidden group">
                        <Image
                          src={category.imageUrl}
                          alt="category"
                          fill
                          className="aspect-square object-cover rounded-md group-hover:scale-110 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      </CardContent>
                    </Card>
                    <span className="flex items-center justify-center">
                      {category.name}
                    </span>
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
