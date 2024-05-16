"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ModalProps {
  title: string;
  description: string;
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  title,
  description,
  isOpen,
  onClose,
  children
}) => {
  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return ( 
    <Dialog   open={isOpen} onOpenChange={onChange}>
      <DialogContent className="rounded-lg" >
        <DialogHeader>
          <div className="flex flex-col justify-center items-center gap-2">
          <DialogTitle >{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
          </div>
        </DialogHeader>
        <div>
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
};