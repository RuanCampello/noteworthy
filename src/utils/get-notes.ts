import { db } from '@/firebase';
import { NoteType } from '@/types/note-type';
import { doc, getDoc } from 'firebase/firestore';
import { Collections } from './find-note';

export default async function getNotes(userId: string, collection: Collections) {
  const noteRef = doc(db, collection, userId);
  const noteDoc = await getDoc(noteRef);
  if (!noteDoc.exists()) return;
  const noteData = noteDoc.data();
  const notes: NoteType[] = noteData.notes;
  return notes;
}
