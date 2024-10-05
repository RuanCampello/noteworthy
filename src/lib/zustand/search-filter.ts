import { create } from 'zustand';

export type Filter = 'Archived' | 'Favourites' | 'None';
type TranslationKeys = 'fav_placeholder' | 'arc_placeholder' | 'placeholder';

export const Placeholders: Record<Filter, TranslationKeys> = {
  Favourites: 'fav_placeholder',
  Archived: 'arc_placeholder',
  None: 'placeholder',
};

interface SearchFilter {
  filter: Filter;
  placeholder: TranslationKeys;
  toggleFilter: () => void;
}

const filterOptions: Filter[] = ['Archived', 'Favourites', 'None'];

export const useFilter = create<SearchFilter>((set) => ({
  filter: 'None',
  placeholder: Placeholders['None'],
  toggleFilter: () => {
    set((state) => {
      const currentIndex = filterOptions.indexOf(state.filter);
      const nextIndex = (currentIndex + 1) % filterOptions.length;
      const nextFilter = filterOptions[nextIndex];
      return {
        filter: nextFilter,
        placeholder: Placeholders[nextFilter],
      };
    });
  },
}));
