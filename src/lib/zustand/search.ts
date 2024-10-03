import type { SearchResult } from '@/types/SearchResult';
import { create } from 'zustand';

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
}

export const useSearch = create<SearchState>((set, get) => ({
  loading: false,
  open: false,
  query: '',
  setQuery: (query: string) => set({ query }),
  searchResults: [],
  activeIndex: -1,
  setLoading: (loading: boolean) => set({ loading }),
  setSearchResults: (results: SearchResult[]) =>
    set({
      searchResults: results,
      activeIndex: -1,
    }),
  increaseIndex: () => {
    const { activeIndex, searchResults } = get();
    if (activeIndex < searchResults.length - 1) {
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
