import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Item } from "@prisma/client";

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
  return (
    <Dialog  open={isOpen} onOpenChange={onChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Item</DialogTitle>
          <DialogDescription>
            Make changes 
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
            <Input value={item.name}/>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
export default ElementModal;