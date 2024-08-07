import { create } from 'zustand';

export type Filter = 'arc' | 'fav' | 'blank';

function getFilterValues<T extends Record<string, FilterProps>>(
  obj: T,
): Array<keyof T> {
  return Object.keys(obj) as Array<keyof T>;
}

type FilterProps = {
  query: string;
  placeholder: TranslationKeys;
};

type TranslationKeys = 'fav_placeholder' | 'arc_placeholder' | 'placeholder';

export const Filters: Record<Filter, FilterProps> = {
  fav: {
    query: 'AND "is_favourite" = true',
    placeholder: 'fav_placeholder',
  },
  arc: {
    query: 'AND "is_archived" = true',
    placeholder: 'arc_placeholder',
  },
  blank: { query: '', placeholder: 'placeholder' },
};

interface SearchFilter {
  filter: Filter;
  placeholder: TranslationKeys;
  toggleFilter: () => void;
}

const filterArray = getFilterValues(Filters);
const initialFilter = filterArray[filterArray.length - 1]; //initialize as blank

export const useFilter = create<SearchFilter>((set) => ({
  filter: initialFilter,
  placeholder: Filters[initialFilter].placeholder,
  toggleFilter: () => {
    set((state) => {
      const currentIndex = filterArray.indexOf(state.filter);
      const nextIndex = (currentIndex + 1) % filterArray.length;
      const nextFilter = filterArray[nextIndex];
      return {
        filter: nextFilter,
        placeholder: Filters[nextFilter].placeholder,
      };
    });
  },
}));
