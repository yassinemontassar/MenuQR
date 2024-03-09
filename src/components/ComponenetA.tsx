import { Menu } from "@prisma/client";
import { Input } from "./ui/input";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Loader, Trash, XIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import { toast } from "./ui/use-toast";
const formSchema = z.object({
  name: z.string().min(1),
  newImage: z.string().min(1),
});

type MenuFormValues = z.infer<typeof formSchema>;

interface MenuFormProps {
  initialData: Menu | null;
}
export const ComponenetA: React.FC<MenuFormProps> = ({ initialData }) => {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const imagePreviewUrl = initialData?.imageUrl ?? "";
  const supabase = createClientComponentClient();
  const form = useForm<MenuFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      newImage: "",
    },
  });

  const uploadFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target?.files?.[0];
    if (!file) {
      console.error("No file selected or access failed.");
      return;
    }
    setLoading(true);
  const bucket = "MenuLogo"
  const folderName = params.userId; 
  const fileName = params.userId + form.getValues("name");
    const filePath = `${folderName}/${fileName}`;
  const { data, error } = await supabase.storage
  .from(bucket)
  .upload(filePath, file, { upsert: true });

  // Handle error if upload failed
  if(error) {
    alert('Error uploading file.');
    return;
  }
  form.setValue("newImage",fileName)
  console.log('File uploaded successfully!');
  setLoading(false);
};


  const onSubmit = async (values: MenuFormValues) => {
    if (image) {
      setLoading(true);
      const bucket = "MenuLogo";
      const subfolder = "logo"
      const folderName = params.userId; // Existing folder name
      const { crypto } = window;
      const randomString = crypto.getRandomValues(new Uint32Array(1))[0].toString(36).padStart(10, '0');
      const uniqueFileName = `${randomString}.${image.name.split('.').pop()}`;
      const filePath = `${folderName}/${subfolder}/${uniqueFileName}`;
  
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, image, { upsert: true });
  
      if (error) {
        alert('Error uploading file.');
        return;
      }
      values.newImage = uniqueFileName
    }
    try {
      setLoading(true);
      console.log(values.newImage)
      const body = { ...values };
      console.log(body)
      await axios.patch(`/api/menus/${params.menuId}`, body);
      router.refresh();
    } catch (error) {
      // toast.error("Something went wrong!");
    } finally {
      toast({
        title: "Menu mis à jour",
        description: `Votre menu ${values.name} a été mis à jour avec succès. Les modifications sont prises en compte.`,
        variant: "default",
    });
    
       setLoading(false);

    }
  };
  return (
    <div className="bg-background   p-8 rounded-lg shadow-lg ring-1 md:p-12 mt-12 ">
      <div className="flex items-center justify-center">
        <Image
          src={imagePreviewUrl}
          alt="logo"
          width={45}
          height={45}
          className="object-cover rounded-md border border-gray-300"
        />
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="w-full max-w-md">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="font-medium">
                    Nom de votre {initialData?.type} :
                  </FormLabel>
                  <FormControl className="mt-1">
                    <Input
                      className="w-full px-3 py-2 placeholder-gray-500 border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Nom de votre panneau publicitaire"
                      disabled={loading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newImage"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="font-medium">Logo</FormLabel>
                  <FormControl className="mt-1">
                    <Input
                      disabled={loading}
                      accept="image/*"
                      type="file"
                      className="w-full"
                      onChange={(e) => {
                        setImage(e.target.files?.[0] || null);
                        field.onChange(e);
                      }}
                    />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                  {image && (
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <Image
                        src={URL.createObjectURL(image)}
                        alt="aperçu"
                        width={50}
                        height={50}
                        className="object-cover w-20 h-20 rounded-md border border-gray-300"
                      />
                      <XIcon
                        onClick={() => setImage(null)}
                        className="cursor-pointer text-red-600"
                      />
                    </div>
                  )}
                </FormItem>
              )}
            />
          </div>
          <Button
            className="w-full px-3 py-2"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Mise à jour en cours...' : 'Mettre à jour'}
            {loading && <Loader size={20} className="text-background animate-spin" />}
          </Button>
        </form>
      </Form>
    </div>
  );
  
};
