import { create } from 'zustand';
import { type State } from './types';

interface SidebarState {
  state: State;
  toggleState: (state: State) => void;
}

export const useSidebarState = create<SidebarState>((set) => ({
  state: 'open',
  toggleState: (state: State) => set({ state }),
}));
