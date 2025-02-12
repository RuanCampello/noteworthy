import { create } from 'zustand';

interface AddNoteDialogState {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}

export const useAddNoteDialog = create<AddNoteDialogState>((set) => ({
  isOpen: false,
  setOpen: (open) => set({ isOpen: open }),
}));
