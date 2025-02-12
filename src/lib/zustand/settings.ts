import { create } from 'zustand';
import { DialogState } from './types';

export const useSettings = create<DialogState>((set) => ({
  isOpen: false,
  setOpen: (isOpen) => set({ isOpen }),
  dropdownOpen: false,
  setDropdownOpen: (dropdownOpen) => set({ dropdownOpen }),
}));
