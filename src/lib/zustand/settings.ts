import { create } from 'zustand';
import { DialogState } from './types';

export const useSettingsStore = create<DialogState>((set) => ({
  isOpen: false,
  setOpen: (isOpen) => set({ isOpen }),
}));
