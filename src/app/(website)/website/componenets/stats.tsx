"use client";

import { Badge } from "@/components/ui/badge";
import { Menu } from "@prisma/client";
import { ClockIcon, ThumbsUpIcon } from "lucide-react";
import Image from "next/image";

interface StatsCard {
    data: Menu;
}

const StatsCard: React.FC<StatsCard> = ({
    data
}) => {
    
    return (
        <div className=" p-6 rounded-lg shadow">

        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Image
            alt="Tacos Chaneb Logo"
            className="h-20 w-20 rounded-full"
            height="80"
            src={data.imageUrl}
            width="80"
          />
          <div>
    
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 my-2">
            <h1 className="text-2xl font-bold">{data.name}</h1>
              <Badge variant="secondary">{data.type}</Badge>
              <Badge>-20% sélection</Badge>
            </div>
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center space-x-1">
                <ThumbsUpIcon className="h-5 w-5 text-green-500" />
                <span>90%</span>
              </div>
              <div className="flex items-center space-x-1">
                <ClockIcon className="h-5 w-5 text-gray-500" />
                <span>11:00 - 23:00</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}
export default StatsCard;