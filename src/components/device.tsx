"use client";
import { phoneModels } from "@/app/lib/phoneModels";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { DeviceFrameset } from "react-device-frameset";
import "react-device-frameset/styles/marvel-devices.min.css";
import { useMediaQuery } from "react-responsive";
interface DevicePreviewProps {
  keyProp: boolean; // Assuming keyProp is a boolean, change the type accordingly
}

const DevicePreview: React.FC<DevicePreviewProps> = ({ keyProp }) => {
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  const [reloadCounter, setReloadCounter] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const params = useParams();
  useEffect(() => {
    const reloadContent = async () => {
      // Set loading state to true before reloading content
      setIsLoading(true);

      // Simulate asynchronous reload, you can replace it with your actual reload logic
      await new Promise((resolve) => setTimeout(resolve, 3000));

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

  const [selectedPhone, setSelectedPhone] = useState(phoneModels[0].value) ; // Default first model
  const handleChange = (newValue: any) => {
    setSelectedPhone(newValue);
    console.log(newValue);
  };

  
  return (
    <>
      <div className="flex flex-col items-center gap-6">
          <select className="p-2 border rounded-md" value={selectedPhone} onChange={(e) => handleChange(e.target.value)}>
            {phoneModels.map((model) => (
              <option key={model.value} value={model.value}>
                {model.label}
              </option>
            ))}
          </select>
           {/* @ts-ignore */}    
        <DeviceFrameset device={selectedPhone}  width={isTabletOrMobile ? 300 : undefined}  >
          <div className="h-full overflow-y-scroll">
            {isLoading ? (
              // Display a loading message while content is being reloaded
              <div className="bg-background flex items-center justify-center h-full">
                <Image
                  src="/images/gif/scan.gif"
                  alt="gif"
                  quality={100}
                  height={120}
                  width={120}
                  priority
                  className="rounded-xl animate-bounce"
                  unoptimized
                />
              </div>
            ) : (
              // Render the iframe when not in loading state
              <iframe
                title="Device Frame"
                key={reloadCounter}
                width="100%"
                height="100%"
                src={`https://www.menurapide.tn/website/${params.menuId}`}
              ></iframe>
            )}
          </div>
        </DeviceFrameset>
      </div>
    </>
  );
};
export default DevicePreview;
