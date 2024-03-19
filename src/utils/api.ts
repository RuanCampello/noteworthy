import { db } from '@/firebase';
import { NoteType } from '@/types/note-type';
import {
  updateDoc,
  doc,
  arrayUnion,
  Timestamp,
  getDoc,
  setDoc,
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { v4 as uuid } from 'uuid';
import { getCollection } from './get-navigation-info';
import { getCookie } from 'cookies-next';
import { User } from '@/types/user-type';

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
  const uid = uuid();
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
  return uid;
}

export type Collections = 'userNotes' | 'userFavourites' | 'userArchived';

export async function findNote(
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

export async function getNotes(userId: string, collection: Collections) {
  const noteRef = doc(db, collection, userId);
  const noteDoc = await getDoc(noteRef);
  if (!noteDoc.exists()) return;
  const noteData = noteDoc.data();
  const notes: NoteType[] = noteData.notes;
  return notes;
}

export async function OverrideNote(
  userId: string,
  noteId: string,
  collection: Collections,
  noteProps?: Partial<NoteType>
) {
  const response = await getDoc(doc(db, collection, userId));
  const data = response.data();
  if (!data) return;
  const notes: NoteType[] = data['notes'];
  if (!notes) return;

  const noteIndex = notes.findIndex((note) => note.uid === noteId);
  if (noteIndex === -1) return;
  const updatedNotes = [...notes];
  updatedNotes[noteIndex] = {
    ...updatedNotes[noteIndex],
    ...noteProps,
  };
  await setDoc(doc(db, collection, userId), { notes: updatedNotes });
}

export async function saveNote(content: string, pathname: string) {
  const userId = getCookie('user_id');
  const openNote = getCookie('open_note');
  const collection = getCollection(pathname);
  if (!userId || !openNote) return;
  await OverrideNote(userId, openNote, collection, {
    content: content,
  });
}

export async function checkUsernameAvailability(
  username: string
): Promise<boolean> {
  const usernameQuery = await getDocs(
    query(collection(db, 'users'), where('name', '==', username))
  );
  return !(usernameQuery.size > 0);
}

export async function updateProfile(
  currentUser: User,
  updateData: Partial<User>
) {
  const userId = getCookie('user_id');
  if (!userId) return;
  const userData = {
    ...currentUser,
    ...updateData,
  };
  await updateDoc(doc(db, 'users', userId), userData);
}
