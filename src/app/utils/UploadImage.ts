"use client"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const uploadImage = async (bucket: string, filePath: string, image: File) => {

    const supabase = createClientComponentClient();
    try {
        const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, image, { upsert: true });
      if (error) {
        console.error('Error uploading image:', error);
      } else {
        console.log('Image uploaded successfully');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };
  export default uploadImage;
  