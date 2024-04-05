import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { zodResolver } from "@hookform/resolvers/zod";
import { Item } from "@prisma/client";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1, { message: "Le nom est requis." }),
  description: z.string().min(0, { message: "Description est requis." }).default("").optional(),
  price: z.coerce
    .number()
    .min(1, { message: "Le prix doit être d'au moins 1." }),
});

type ElementFormValues = z.infer<typeof formSchema>;

interface MyModalProps {
    isOpen: boolean;
    onClose: () => void;
    item: Item,
  }
  

  const ElementModal: React.FC<MyModalProps> = ({ isOpen, onClose, item }) => {
    const onChange = (open: boolean) => {
        if (!open) {
          onClose();
        }
      };

      const defaultValues = item
      ? {
          ...item,
          price: parseFloat(String(item?.price)),
        }
      : {
          name: "",
          price: 0,
        };

      const form = useForm<ElementFormValues> ({
        resolver: zodResolver(formSchema),
        defaultValues
      });

      
  const onSubmit = async (data: ElementFormValues) => {
   console.log(data)
  };
  return (
    <Dialog  open={isOpen} onOpenChange={onChange} >
      <DialogContent className=" sm:max-w-[425px] rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-center">Modification</DialogTitle>
        </DialogHeader>
        <Form {...form} >
            <form   onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 p-1  "
            >
                <div className="grid gap-4 py-4 ">
                <FormField 
                control={form.control}
                name="name"
                render={({field}) =>(
                    <FormItem>
                        <FormLabel>Nom</FormLabel>
                        <FormControl>
                            <Input className="w-auto" 
                             placeholder="Nom de votre élément"
                            {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                />
                   <FormField 
                control={form.control}
                name="description"
                render={({field}) =>(
                    <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                            <Input className="w-auto" 
                          placeholder="Description de votre élément"
                            {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                />
                       <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prix</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        // disabled={loading}
                        placeholder="9.99"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
                </div>
                <Button  
                // disabled={loading}
                className="ml-auto w-full"
                type="submit"
                >
                    Enregistrer les modification
                </Button>

            </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
export default ElementModal;