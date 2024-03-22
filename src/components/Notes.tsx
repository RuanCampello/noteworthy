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
    const { uid, title, colour, content, date, owner, lastUpdate } = note;
    return {
      uid: uid,
      title: title,
      colour: colour,
      content: content,
      date: date,
      owner: owner,
      lastUpdate: lastUpdate,
    };
  });
  const { notes: filteredNotes, searchParam } = getFilteredNotes(notes);
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
      <div className='flex flex-col gap-2 overflow-y-scroll scrollbar-thin scrollbar-track-black scrollbar-thumb-silver xl:max-h-[400px] lg:max-h-[300px] max-h-[230px] px-5 pb-1'>
        {filteredNotes.length === 0 && searchParam ? (
          <div className='bg-midnight h-[100px] w-full rounded-sm lg:p-5 p-2 outline-2 outline-offset-2 outline-dashed outline-silver text-silver my-2 select-none'>
            <h1 className='text-lg line-clamp-2 overflow-clip'>
              No note with such name as{' '}
              <span className='italic font-medium'>{searchParam}</span>
            </h1>
          </div>
        ) : (
          filteredNotes.map((note) => {
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
          })
        )}
      </div>
    </div>
  );
}
