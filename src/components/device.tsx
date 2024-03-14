"use client"

import { useEffect, useState } from 'react';
import { DeviceFrameset } from 'react-device-frameset'
import 'react-device-frameset/styles/marvel-devices.min.css'
import { Button } from './ui/button';
import Link from 'next/link';
import { useParams } from 'next/navigation';
interface DevicePreviewProps {
  keyProp: boolean; // Assuming keyProp is a boolean, change the type accordingly
}

const DevicePreview: React.FC<DevicePreviewProps> = ({ keyProp }) => {
  const [reloadCounter, setReloadCounter] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const params = useParams();
  useEffect(() => {
    const reloadContent = async () => {
      // Set loading state to true before reloading content
      setIsLoading(true);

      // Simulate asynchronous reload, you can replace it with your actual reload logic
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Reset loading state after reloading content
      setIsLoading(false);

      // Trigger content reload by updating the reloadCounter
      setReloadCounter((prevCounter) => prevCounter + 1);
    };

    // Call the reloadContent function when the keyProp changes
    reloadContent();

    // Cleanup function (optional, runs when the component is unmounted or remounted)
    return () => {
      // Add any cleanup logic here
    };
  }, [keyProp]); // Include keyProp in the dependency array to trigger the effect on key change


  return (
    <>
      <DeviceFrameset device="Samsung Galaxy S5" color="black">
        <div className="h-full overflow-y-scroll">
          {isLoading ? (
            // Display a loading message while content is being reloaded
            <p className="text-2xl text-gray-500 animate-pulse flex items-center justify-center h-full">Loading...</p>

          ) : (
            // Render the iframe when not in loading state
            <iframe key={reloadCounter} width="100%" height="100%" src={`${process.env.NEXT_PUBLIC_BASE_URL}/website/${params.menuId}`}></iframe>

          )}
        </div>

        
      </DeviceFrameset>
  </>
  );
}
export default DevicePreview;