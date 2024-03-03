"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
// import { toast } from "react-hot-toast";
import axios from "axios";
import { useMenuModal } from "@/app/hooks/use-menu-modal";
import { useParams } from "next/navigation";
import Image from "next/image";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { XIcon } from "lucide-react";
import { toast } from "../ui/use-toast";
import { ToastAction } from "../ui/toast";


const formSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required." })
    .max(50, { message: "Name cannot be longer than 50 characters." }),
  type: z.string().min(1, {message: "Please you have to select a type"}),
  imageUrl: z.string().min(1, {message: "Select an image!"})
});


export const MenuModal = () => {
  const supabase = createClientComponentClient();
  const params = useParams();
  const [image, setImage] = useState<File | null>(null);
  const MenuModal = useMenuModal();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "",
      imageUrl: ""
    },
  });

  const uploadFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target?.files?.[0];
    if (!file) {
      console.error("No file selected or access failed.");
      return;
    }
    setLoading(true);
    const bucket = "MenuLogo";
    const folderName = params.userId; // Existing folder name
    const { crypto } = window;
    const randomString = crypto.getRandomValues(new Uint32Array(1))[0].toString(36).padStart(10, '0');
    const uniqueFileName = `${randomString}.${file.name.split('.').pop()}`;
    // Combine folder and subfolder names for file path
    // const fileName = params.userId + form.getValues("name");
    const filePath = `${folderName}/${uniqueFileName}`;
  
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, { upsert: true });
  
    // Handle error if upload failed
    if (error) {
      alert('Error uploading file.');
      return;
    }
  
    form.setValue("imageUrl", uniqueFileName);
    setLoading(false);
    console.log('File uploaded successfully!');
  };
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
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
  
      values.imageUrl = uniqueFileName;
    }
    try {
       setLoading(true);
      // values.imageUrl= params.userId+"logo"
      const body = { ...values};
      const response = await axios.post("/api/menus", body);
      window.location.assign(`menu/${response.data.id}`);
    } catch (error) {
      toast({
        title: "Oups ! Quelque chose s'est mal passé.",
        description: "Il y a eu un problème avec votre demande.",
        action: <ToastAction altText="Réessayer">Réessayer</ToastAction>,
        variant:"destructive"
      })
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Création de Menu"
      description="Remplissez les informations ci-dessous"
      isOpen={MenuModal.isOpen}
      onClose={MenuModal.onClose}
    >
      <div>
        <div className="space-y-4 py-2 pb-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Nom de votre magasin"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Choisissez votre type</FormLabel>
                    <FormControl>
                      <Select
                        disabled={loading}
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="">
                          <SelectValue
                            defaultValue={field.value}
                            placeholder="Type"
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Restaurant">Restaurant</SelectItem>
                          <SelectItem value="Cafe">Café</SelectItem>
                          <SelectItem value="CafeR">Café-Restaurant</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Logo</FormLabel>
                    <FormControl>
                      <Input
                        accept="image/*"
                        type="file"
                        disabled={loading}
                        onChange={(e) => {
                          setImage(e.target.files?.[0] || null);
                          field.onChange(e);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                    {image && (
                      <div className="flex items-center justify-center gap-2">
                        <Image
                          src={URL.createObjectURL(image)}
                          alt="aperçu"
                          width={50}
                          height={50}
                          className="object-cover w-20 h-20 rounded-md"
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
              <div className="pt-6 space-x-2 flex items-center justify-center w-full">
                <Button
                  disabled={loading}
                  variant="outline"
                  onClick={MenuModal.onClose}
                >
                  Annuler
                </Button>
                <Button disabled={loading} type="submit">
                  Continuer
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Modal>
  );
  
};
