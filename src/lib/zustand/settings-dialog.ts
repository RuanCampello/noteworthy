import { create } from 'zustand';
import { DialogState } from './types';

export const useSettingsDialogStore = create<DialogState>((set) => ({
  isOpen: false,
  setOpen: (isOpen) => set({ isOpen }),
}));
