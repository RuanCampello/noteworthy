import { db } from '@/firebase';
import { NoteType } from '@/types/note-type';
import { doc, getDoc } from 'firebase/firestore';

export type Collections = 'userNotes' | 'userFavourites'

export default async function findNote(
  userId: string,
  collection: Collections,
  noteId: string
): Promise<NoteType | null> {
  const noteRef = doc(db, collection, userId);
  const noteDoc = await getDoc(noteRef);
  if (!noteDoc.exists()) return null;
  const noteData = noteDoc.data();
  const note: NoteType = noteData.notes.find(
    (note: NoteType) => note.uid === noteId
  );
  return note;
}
