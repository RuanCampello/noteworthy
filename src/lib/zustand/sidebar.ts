import { create } from 'zustand';

type State = 'open' | 'closed';

interface SidebarState {
  state: State;
  toggleState: (state: State) => void;
}

export const useSidebarState = create<SidebarState>((set) => ({
  state: 'open',
  toggleState: (state: State) => {
    set((prevState) => ({
      state: state === 'open' ? 'closed' : 'open',
    }));
  },
}));
