import { db } from '@/firebase';
import { NoteType } from '@/types/note-type';
import { doc, getDoc } from 'firebase/firestore';
import { cookies } from 'next/headers';
import AnimatedCounter from './AnimatedCounter';

export default async function Counter() {
  async function getNumberNotes() {
    'use server';
    const user_id = cookies().get('user_id')?.value;
    if (!user_id) return;

    const notesRef = doc(db, 'userNotes', user_id);
    const noteDoc = (await getDoc(notesRef)).data();
    if (!noteDoc) return;
    const notes: NoteType[] = noteDoc['notes'];
    return notes;
  }
  const notesNumber = await getNumberNotes();
  if (!notesNumber) return null;
  return (
    <div className='bg-midnight text-silver overflow-hidden select-none px-2 h-6 text-center items-center flex rounded-sm'>
      <AnimatedCounter value={notesNumber.length} />
    </div>
  );
}
