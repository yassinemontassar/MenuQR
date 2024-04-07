"use client"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const deleteImage = async (bucket: string, file: string) => {

    const supabase = createClientComponentClient();
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .remove([file]);
      if (error) {
        console.error('Error deleting image:', error);
      } else {
        console.log('Image deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };
  export default deleteImage;
   