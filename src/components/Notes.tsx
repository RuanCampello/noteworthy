import { doc, getDoc } from 'firebase/firestore';
import Note from './Note';
import SectionTitle from './SectionTitle';
import { db } from '@/firebase';
import { cookies, headers } from 'next/headers';
import { NoteType } from '@/types/note-type';
import Counter from './Counter';
import SearchNote from './SearchNote';
import getFilteredNotes from '@/utils/get-filtered-notes';

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

  const filteredNotes = getFilteredNotes(notes)
  return (
    <div>
      <SectionTitle title='Notes'>
        <Counter />
      </SectionTitle>
      <SearchNote />
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
