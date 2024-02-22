import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import Note from './Note';
import SectionTitle from './SectionTitle';
import { db } from '@/firebase';
import { cookies } from 'next/headers';
import { NoteType } from '@/types/note-type';
import { revalidateTag } from 'next/cache';

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
      id: uid,
      title: title,
      colour: colour,
      content: content,
      date: date,
      owner: owner,
    };
  });
  revalidateTag('update-notes')
  return (
    <div>
      <SectionTitle title='Notes' />
      <div className='flex flex-col gap-2 overflow-y-scroll scrollbar-thin scrollbar-track-black scrollbar-thumb-silver max-h-[400px] px-5'>
        {notes.map((note) => {
          return (
            <Note
              key={note.id}
              id={note.id}
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
