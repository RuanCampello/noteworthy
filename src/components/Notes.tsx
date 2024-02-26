import { doc, getDoc } from 'firebase/firestore';
import Note from './Note';
import SectionTitle from './SectionTitle';
import { db } from '@/firebase';
import { cookies } from 'next/headers';
import { NoteType } from '@/types/note-type';
import Counter from './Counter';
import SearchNote from './SearchNote';
import SortDropdown from './SortDropdown';
import { getFilteredNotes, getFilter } from '@/utils/format-notes';

export default async function Notes() {
  const id = cookies().get('user_id')?.value;
  if (!id) return null;

  const notesRef = doc(db, 'userNotes', id);
  const notesQuery = await getDoc(notesRef);
  const notesData = notesQuery.data();
  if (!notesData) return null;
  const notesArray = notesData['notes'] as NoteType[];

  const notes = notesArray.map((note) => {
    const { uid, title, colour, content, date, owner } = note;
    return {
      uid: uid,
      title: title,
      colour: colour,
      content: content,
      date: date,
      owner: owner,
    };
  });
  const filteredNotes = getFilteredNotes(notes);
  const filter = getFilter();

  if (filter === 'date-new') {
    filteredNotes.sort(
      (a, b) =>
        new Date(b.date.seconds * 1000).getTime() -
        new Date(a.date.seconds * 1000).getTime()
    );
  } else if (filter === 'date-old') {
    filteredNotes.sort(
      (a, b) =>
        new Date(a.date.seconds * 1000).getTime() -
        new Date(b.date.seconds * 1000).getTime()
    );
  } else if (filter === 'title') {
    filteredNotes.sort((a, b) => a.title.localeCompare(b.title));
  }

  return (
    <div>
      <SectionTitle title='Notes'>
        <Counter type='userNotes' />
      </SectionTitle>
      <div className='px-5 flex gap-2 items-center'>
        <SearchNote />
        <SortDropdown />
      </div>
      <div className='flex flex-col gap-2 overflow-y-scroll scrollbar-thin scrollbar-track-black scrollbar-thumb-silver max-h-[400px] px-5'>
        {filteredNotes.map((note) => {
          return (
            <Note
              href='notes'
              key={note.uid}
              uid={note.uid}
              colour={note.colour}
              name={note.title}
              text={note.content}
              date={note.date.seconds}
            />
          );
        })}
      </div>
    </div>
  );
}
