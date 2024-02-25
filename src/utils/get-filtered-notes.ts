import { NoteType } from '@/types/note-type';
import { headers } from 'next/headers';

export default function getFilteredNotes(notes: NoteType[]) {
  const searchParams = headers().get('searchParams');
  const searchParamsString = searchParams
    ?.replace(/\+/g, ' ')
    .replace(/^name=/, '');

  if (searchParamsString) {
    return notes.filter((note) =>
      note.title.toLowerCase().includes(searchParamsString.toLocaleLowerCase())
    );
  } else {
    return notes;
  }
}
