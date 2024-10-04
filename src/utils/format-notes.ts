import type { Note } from '@/types/Note';
import { headers } from 'next/headers';
import { cache } from 'react';
import { allowedFilters, type Filters } from './constants/filters';

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
