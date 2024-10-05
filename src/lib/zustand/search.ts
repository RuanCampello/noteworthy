import type { SearchResult } from '@/types/SearchResult';
import { LucideProps } from 'lucide-react';
import { ComponentType } from 'react';
import { create } from 'zustand';

export type Action = {
  displayName: string;
  onSelect: () => void;
  icon: ComponentType<LucideProps>;
};

interface SearchState {
  loading: boolean;
  searchResults: SearchResult[];
  activeIndex: number;
  setLoading: (loading: boolean) => void;
  setSearchResults: (results: SearchResult[]) => void;
  increaseIndex: () => void;
  decreaseIndex: () => void;
  resetIndex: () => void;
  selectItem: (index: number) => void;
  query: string;
  setQuery: (query: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  actions: Action[];
  setActions: (actions: Action[]) => void;
}

export const useSearch = create<SearchState>((set, get) => ({
  loading: false,
  open: false,
  query: '',
  setQuery: (query: string) => set({ query }),
  searchResults: [],
  actions: [],
  activeIndex: -1,
  setLoading: (loading: boolean) => set({ loading }),
  setSearchResults: (results: SearchResult[]) =>
    set({
      searchResults: results,
      activeIndex: -1,
    }),
  setActions: (actions: Action[]) => set({ actions }),
  increaseIndex: () => {
    const { activeIndex, searchResults, actions } = get();
    if (activeIndex < searchResults.length - 1 + actions.length) {
      set({ activeIndex: activeIndex + 1 });
    }
  },
  decreaseIndex: () => {
    const { activeIndex } = get();
    if (activeIndex > 0) {
      set({ activeIndex: activeIndex - 1 });
    }
  },
  resetIndex: () => set({ activeIndex: -1 }),
  selectItem: (index: number) => set({ activeIndex: index }),
  setOpen: (open: boolean) => set({ open }),
}));
