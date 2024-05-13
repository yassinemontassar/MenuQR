"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import axios from "axios";
import debounce from "lodash.debounce";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa6";
import { Input } from "./input";
type Photo = {
  id: number;
  width: number;
  height: number;
  urls: {
    large: string;
    regular: string;
    raw: string;
    small: string;
    thumb: string;
  };
  color: string | null;
  user: {
    username: string;
    name: string;
  };
};
interface UnsplashDialogProps {
  onImageSelect: (imageUrl: string) => void;
}

const UnsplashDialog: React.FC<UnsplashDialogProps> = ({ onImageSelect }) => {
  const [photos, setPhotos] = useState<Photo[]>([]); // State for fetched photos
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [isOpen, setIsOpen] = useState(false); // State for dialog visibility
  const [selectedImageId, setSelectedImageId] = useState<number | null>(null); // State for selected image ID
  const [isLoading, setIsLoading] = useState(false);
  // Update the click handler to set the selected image ID
  const handleImageClick = (photo: Photo) => {
    setSelectedImageId(photo.id); // Set the selected image ID
  };

  // Add a click handler for the "Select" button
  const handleSelectClick = () => {
    // Find the selected photo object by ID
    const selectedPhoto = photos.find((photo) => photo.id === selectedImageId);
    if (selectedPhoto) {
      onImageSelect(selectedPhoto.urls.thumb);
      setIsOpen(false);
    }
  };

  useEffect(() => {
    // Define fetchPhotos inside useEffect
    const fetchPhotos = async () => {
      setIsLoading(true); // Set loading to true before the API call
      try {
        if (searchTerm) {
          const response = await axios.get(
            `/api/unsplash/?query=${searchTerm}`
          );
          setPhotos(response.data.results);
        } else {
          setPhotos([]); // Clear photos if search term is empty
        }
      } catch (error) {
        console.error("Error fetching photos:", error);
        // Handle errors gracefully, e.g., display an error message to the user
      } finally {
        setIsLoading(false); // Set loading to false after the API call
      }
    };

    // Define the debounced function inside useEffect
    const debouncedFetchPhotos = debounce(() => {
      fetchPhotos();
    }, 1200);

    debouncedFetchPhotos();

    // Cancel the debounce on useEffect cleanup
    return () => {
      debouncedFetchPhotos.cancel();
    };
    // Include searchTerm in the dependency array
  }, [searchTerm]);

  return (
    <Dialog  open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full px-3 py-2">
          Choisir image en ligne
        </Button>
      </DialogTrigger>
      <DialogContent  className="sm:max-w-[800px] w-full p-4 sm:p-6">
        <DialogHeader>
          <Input
            className="w-full max-w-[300px] sm:max-w-none mt-4"
            placeholder="Search images..."
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // Update search term on input change
          />
        </DialogHeader>
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <FaSpinner className="animate-spin text-2xl" />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 py-4 max-h-[500px] overflow-auto">
            {photos.map((photo) => (
              <div key={photo.id}>
                <div
                  onClick={() => handleImageClick(photo)}
                  className={`relative group cursor-pointer p-1 ${
                    selectedImageId === photo.id
                      ? "ring-2 ring-orange-500 shadow-lg scale-105 transform transition duration-300"
                      : " ring-gray-300"
                  } rounded-lg`}
                >
                  {/* Overlay for selected image */}
                  {selectedImageId === photo.id && (
                    <div className="absolute inset-0 bg-black  opacity-25 rounded-lg" />
                  )}

                  <Image
                    alt={`Photo by ${photo.user.name}`}
                    className="rounded-lg object-cover w-full aspect-square group-hover:opacity-50 transition-opacity"
                    src={photo.urls.thumb}
                    placeholder="blur"
                    blurDataURL="data:image/webp;base64,UklGRgIDAABXRUJQVlA4WAoAAAAgAAAAowAAowAASUNDUMgBAAAAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADZWUDggFAEAAFANAJ0BKqQApAA+7XawVamnJCMgSYkwHYlpbt1eIivgBQTRJBl7y0CpJfFdwPK8Dm/jQKIiWqD/2BnORvrgxrY5EoR4Yg+oq7dcm83ECqnLAunixQg9P7OJzMt086nh205kNKXZ89y+V+WzIAyrfeuTq+AA/ulrVS6/ccGKnqhlMjCCrWJkp2JSF75ecL5rm4UKwPXFaCCSFNKa3csikWUK94YtcAk4NaINmLnBHfN3ZRfOfAxm6zGMC0NZljgbH9RvNGoqMr6Htk2l9yAcm5XDAEAwQaMyqZYOhwdyxuZqW+1dsVglVmbKOQkSK5yv3o4l+ZMkyGslzr/q3k5GSR9/J3plC04lYb0EG6uYzTEfCAAAAA=="
                    width={150}
                    height={150}
                  />
                </div>
                <div className="mt-2 flex items-center justify-center">
                  <Link
                    prefetch={false}
                    target="_blank"
                    className="credit "
                    href={`https://unsplash.com/@${photo.user.username}`}
                  >
                    {photo.user.name}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          <Button
            className="w-full sm:w-auto"
            variant="outline"
            onClick={() => setIsOpen(false)}
          >
            Annuler
          </Button>
          <Button
            className="w-full sm:w-auto ml-auto"
            onClick={handleSelectClick}
          >
            Ajouter
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default UnsplashDialog;
