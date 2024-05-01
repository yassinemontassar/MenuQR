"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Currency from "@/components/ui/currency";
import { Label } from "@/components/ui/label";
import { Category, Item } from "@prisma/client";
import Image from "next/image";
import { useEffect, useState } from "react";

interface StatsCard {
  data: Category[];
}
const ShowAll: React.FC<StatsCard> = ({ data }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(""); // State to hold selected category

  useEffect(() => {
    if (data.length > 0) {
      setSelectedCategory(data[0].id); // Set the default selected category to the first category in the list
    }
  }, [data]);

  // Event handler for category selection change
  const handleCategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedCategory(event.target.value);
  };
  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-2">Choisissez une catégorie :</h2>{" "}
      {/* Added label for select box */}
      <div className="flex gap-4 items-center">
        <div className="flex flex-col">
          <Label className="sr-only" htmlFor="categories">
            Categories
          </Label>
          <select
            id="categories"
            className="block w-full p-2 pr-8 border rounded-md shadow-sm focus:outline-none focus:border-blue-500"
            onChange={handleCategoryChange}
            value={selectedCategory}
          >
            {data.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-6">
        {data.map((category) => {
          if (selectedCategory === category.id) {
            // Filter items based on selected category
            return (
              <div key={category.id}>
                <h2 className="text-xl font-semibold mb-4">{category.name}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(category as any).Items.map((item: Item) => (
                    <Card key={item.id} className="w-full">
                      <CardHeader>
                        <CardTitle>{item.name}</CardTitle>
                        <CardDescription>{item.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="aspect-square rounded-xl relative">
                          <Image
                             loading="lazy"
                            alt={item.name}
                            fill
                            src={item.imageUrl}
                            placeholder="blur"
                            blurDataURL="data:image/webp;base64,UklGRgIDAABXRUJQVlA4WAoAAAAgAAAAowAAowAASUNDUMgBAAAAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADZWUDggFAEAAFANAJ0BKqQApAA+7XawVamnJCMgSYkwHYlpbt1eIivgBQTRJBl7y0CpJfFdwPK8Dm/jQKIiWqD/2BnORvrgxrY5EoR4Yg+oq7dcm83ECqnLAunixQg9P7OJzMt086nh205kNKXZ89y+V+WzIAyrfeuTq+AA/ulrVS6/ccGKnqhlMjCCrWJkp2JSF75ecL5rm4UKwPXFaCCSFNKa3csikWUK94YtcAk4NaINmLnBHfN3ZRfOfAxm6zGMC0NZljgbH9RvNGoqMr6Htk2l9yAcm5XDAEAwQaMyqZYOhwdyxuZqW+1dsVglVmbKOQkSK5yv3o4l+ZMkyGslzr/q3k5GSR9/J3plC04lYb0EG6uYzTEfCAAAAA=="
                            sizes="(max-width: 768px) 320px, (max-width: 1200px) 640px, 1280px"
                          />
                        </div>
                      </CardContent>
                      <CardFooter className="flex items-center justify-center ">
                        <span className=" text-xl font-medium">
                          <Currency value={item.price.toString()} />
                        </span>
                        {/* <span className="text-sm line-through text-gray-500">
                          56,000DT
                        </span> */}
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            );
          } else {
            return null; // Return null if category does not match the selected category
          }
        })}
      </div>
    </div>
  );
};
export default ShowAll;
