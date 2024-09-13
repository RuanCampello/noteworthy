import { headers } from 'next/headers';
import type { Note } from '../types/database-types';
import { allowedFilters, type Filters } from './constants/filters';
import { formatSearchParams } from './format';
import { cache } from 'react';

export type FilteredResults = {
  notes: Note[];
  searchParam?: string;
};

function getSearchParams(): string | null {
  return headers().get('search-params');
}

export const getPathnameParams = cache(() => {
  const origin = headers().get('origin');
  const pathname = headers().get('pathname');
  return { basePath: pathname?.split('/')[1], origin };
});

export function getFilter() {
  const searchParams = getSearchParams();
  if (!searchParams) return;
  const sortParamsMatch = searchParams.match(/filter=([^&]*)/);
  if (!sortParamsMatch) return;
  const sortParams = sortParamsMatch[1] as Filters;
  if (Object.values(allowedFilters).includes(sortParams)) return sortParams;
}

export function getFilteredNotes(notes: Note[]): FilteredResults {
  const searchParams = getSearchParams();
  if (!searchParams) return { notes: notes };
  const search = searchParams.match(/name=([^&]*)/);
  if (!search) return { notes: notes };
  const searchParamsString = formatSearchParams(search[1]);
  if (searchParamsString) {
    return {
      notes: notes.filter((note) =>
        note.title.toLowerCase().includes(searchParamsString.toLowerCase()),
      ),
      searchParam: searchParamsString,
    };
  } else {
    return { notes: notes, searchParam: searchParamsString };
  }
}
