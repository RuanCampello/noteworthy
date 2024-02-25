import { NoteType } from '@/types/note-type';
import { headers } from 'next/headers';
import { formatSearchParams } from './format';

export default function getFilteredNotes(notes: NoteType[]) {
  const searchParams = headers().get('searchParams');
  const searchParamsString = formatSearchParams(searchParams || '');
  if (searchParamsString) {
    return notes.filter((note) =>
      note.title.toLowerCase().includes(searchParamsString.toLocaleLowerCase())
    );
  } else {
    return notes;
  }
}
