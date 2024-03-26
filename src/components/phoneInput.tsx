"use client";
import React, { useEffect, useState } from "react";

import { Category, Menu } from "@prisma/client";

import DevicePreview from "./device";
import { ComponenetA } from "./ComponenetA";
import { ComponenetB } from "./ComponenetB";
import { Button } from "./ui/button";
import { ComponenetC } from "./ComponenetC";
import ComponenetD from "./ComponentD";

interface MenuFormProps {
  initialData: Menu | null;
  initialData2:
    | {
        id: string;
        MenuId: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
      }[]
    | null; // make it an array
}

export const PhoneInput: React.FC<MenuFormProps> = ({ initialData }) => {
  const [reloadDevicePreview, setReloadDevicePreview] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [currentComponent, setCurrentComponent] = useState<JSX.Element>(
    <ComponenetA initialData={initialData} />
  );

  // Define component map and initial index
  const componentMap: { [key: number]: React.JSX.Element } = {
    "0": <ComponenetA initialData={initialData} />,
    "1": <ComponenetB />,
    "2": <ComponenetC />,
    "3": <ComponenetD />,
  };

  const [currentIndex, setCurrentIndex] = useState(0);
  const isLastComponent = currentIndex === Object.keys(componentMap).length - 1;
  // Clear explanation of switchComponent function
  const switchComponent = (direction: "previous" | "next") => {
    // Handle boundary cases (first and last component)
    if (buttonDisabled) return; // Do nothing if buttons are disabled

    // Disable the buttons
    setButtonDisabled(true);

    // Enable the buttons after a delay (e.g., 1000 milliseconds or 1 second)
    setTimeout(() => {
      setButtonDisabled(false);
    }, 2500);
    if (direction === "previous" && currentIndex === 0) return;
    if (
      direction === "next" &&
      currentIndex === Object.keys(componentMap).length - 1
    )
      return;

    const nextIndex =
      direction === "previous" ? currentIndex - 1 : currentIndex + 1;
    setCurrentIndex(nextIndex);
    setCurrentComponent(componentMap[nextIndex]);
    handleReloadDevicePreview();
  };

  // Clear explanation of handleReloadDevicePreview function
  const handleReloadDevicePreview = () => {
    setReloadDevicePreview((prevState) => !prevState);
  };

  return (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 mt-20">
  <div className="flex flex-col items-center rounded-md border border-gray-300 shadow-md p-6">
    {currentComponent}
    <div className="mt-6 flex items-center justify-center space-x-4">
      <Button
      size="lg"
        className={`px-4 py-2 rounded-md ${buttonDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700 bg-blue-500 text-white focus:outline-none focus:shadow-outline-blue'}`}
        disabled={buttonDisabled}
        onClick={() => switchComponent("previous")}
      >
        Étape précédente
      </Button>
      <Button
      size="lg"
        className={`px-4 py-2 rounded-md ${(isLastComponent || buttonDisabled) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700 bg-blue-500 text-white focus:outline-none focus:shadow-outline-blue'}`}
        disabled={isLastComponent || buttonDisabled}
        onClick={() => switchComponent("next")}
      >
        Étape suivante
      </Button>
    </div>
  </div>
  <div className="flex flex-col items-center rounded-md border border-gray-300 shadow-md p-6">
    <p className="text-center font-medium mb-8">Aperçu</p>
    <DevicePreview keyProp={reloadDevicePreview} />
  </div>
</div>
  );
};
