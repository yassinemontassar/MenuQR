"use client"
import React, { useEffect, useState } from 'react';

import { Category, Menu } from '@prisma/client';

import DevicePreview from './device';
import { ComponenetA } from './ComponenetA';
import { ComponenetB } from './ComponenetB';
import { Button } from './ui/button';
import { ComponenetC } from './ComponenetC';

interface MenuFormProps {
  initialData: Menu | null;
  initialData2: {
    id: string;
    MenuId: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
  }[] | null; // make it an array
}

export const PhoneInput: React.FC<MenuFormProps> = ({ initialData, initialData2 }) => {
  const [reloadDevicePreview, setReloadDevicePreview] = useState(false);
  const [currentComponent, setCurrentComponent] = useState<JSX.Element>(
    <ComponenetA initialData={initialData} />
  );

  // Define component map and initial index
  const componentMap: { [key: number]: React.JSX.Element } = {
    '0': <ComponenetA initialData={initialData} />,
    '1': <ComponenetB />,
    '2': <ComponenetC />,
  };
  
  const [currentIndex, setCurrentIndex] = useState(0);

  // Clear explanation of switchComponent function
  const switchComponent = (direction: 'previous' | 'next') => {
    // Handle boundary cases (first and last component)
    if (direction === 'previous' && currentIndex === 0) return;
    if (direction === 'next' && currentIndex === Object.keys(componentMap).length - 1) return;

    const nextIndex = direction === 'previous' ? currentIndex - 1 : currentIndex + 1;
    setCurrentIndex(nextIndex);
    setCurrentComponent(componentMap[nextIndex]);
  };

  // Clear explanation of handleReloadDevicePreview function
  const handleReloadDevicePreview = () => {
    setReloadDevicePreview((prevState) => !prevState);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2">
    <div className="flex flex-col items-center border rounded-md border-solid border-foreground p-8 ">
      {currentComponent}
      <div className="flex items-center justify-center space-x-8 p-6">
        <Button onClick={() => switchComponent('previous')}>Étape précédente</Button>
        <Button onClick={() => switchComponent('next')}>Étape suivante</Button>
      </div>
    </div>
    <div className="flex flex-col items-center border rounded-md border-solid border-foreground p-8">
      <p className="text-center mb-5">Aperçu</p>
      <DevicePreview keyProp={reloadDevicePreview} />
    </div>
  </div>
  
  );
};
