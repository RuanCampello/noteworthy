import { headers } from 'next/headers';
import { formatSearchParams } from './format';
import { Note } from '@prisma/client';

interface FilteredResults {
  notes: Note[];
  searchParam?: string;
}

export function getFilteredNotes(
  notes: Note[]
): FilteredResults {
  const searchParams = headers().get('search-params');
  if (!searchParams) return { notes: notes };
  const search = searchParams.match(/name=([^&]*)/);
  if (!search) return { notes: notes };
  const searchParamsString = formatSearchParams(search[1]);
  if (searchParamsString) {
    return {
      notes: notes.filter((note) =>
        note.title
          .toLowerCase()
          .includes(searchParamsString.toLocaleLowerCase())
      ),
      searchParam: searchParamsString,
    };
  } else {
    return { notes: notes, searchParam: searchParamsString };
  }
}

type Filters = 'date-new' | 'date-old' | 'title' | 'last-modified';

const allowedFilters: Filters[] = ['date-new', 'date-old', 'title'];

export function getFilter() {
  const searchParams = headers().get('search-params');
  if (!searchParams) return;
  const sortParamsMatch = searchParams.match(/filter=([^&]*)/);
  if (!sortParamsMatch) return;
  const sortParams = sortParamsMatch[1] as Filters;
  if (Object.values(allowedFilters).includes(sortParams)) return sortParams;
}
