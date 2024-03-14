"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
    const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedCategory(event.target.value);
    };
  return (
    <div className="mt-6">
      <div className="flex gap-4 items-center">
        <div className="flex flex-col">
          <label className="sr-only" htmlFor="sections">
            Sections
          </label>
          <select
            id="categories"
            className="block  p-2 border rounded-md shadow-sm focus:outline-none focus:border-blue-500"
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
          if ( selectedCategory === category.id) { // Filter items based on selected category
            return (
              <div key={category.id}>
                <h2 className="text-xl font-semibold mb-4">{category.name}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(category as any).Items.map((item: Item) => ( 
                    <Card key={item.id} className="w-full">
                      <CardHeader>
                        <CardTitle>{item.name}</CardTitle>
                        <CardDescription>
                          {item.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="aspect-square rounded-xl relative">
                          <Image
                            alt={item.name}
                            fill
                            src={item.imageUrl}
                            className="aspect-square rounded-md"
                            sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 25vw"
                          />
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between items-center">
                        <span className="text-xl font-bold">{`${item.price} DT`}</span>
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
