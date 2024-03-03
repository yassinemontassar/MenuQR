import { create } from 'zustand';

interface useMenuModalMenu {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useMenuModal = create<useMenuModalMenu>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));