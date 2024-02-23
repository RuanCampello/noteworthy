import { db } from '@/firebase';
import { Timestamp, arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { v4 as uuid } from 'uuid';

interface addNoteProps {
  userId: string;
  title: string;
  content: string;
  owner: string;
  colour: string;
}

export async function addNote({
  userId,
  title,
  content,
  owner,
  colour,
}: addNoteProps) {
  const uid = uuid()
  await updateDoc(doc(db, 'userNotes', userId), {
    notes: arrayUnion({
      uid: uid,
      title: title,
      content: content,
      owner: owner,
      date: Timestamp.now(),
      colour: colour,
    }),
  });
  return uid
}
