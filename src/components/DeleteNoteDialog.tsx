import { ReactNode } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { NoteType } from '@/types/note-type';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

interface DeleteNoteDialogProps {
  children: ReactNode;
  noteName: string;
}

export default function DeleteNoteDialog({
  children,
  noteName,
}: DeleteNoteDialogProps) {
  const user_id = cookies().get('user_id')?.value;

  async function handleDeleteNote() {
    'use server';
    const note_id = cookies().get('open_note')?.value;
    if (!user_id || !note_id) return;
    const noteRef = doc(db, 'userNotes', user_id);
    const noteDoc = await getDoc(noteRef);
    if (!noteDoc.exists()) return;
    const noteData = noteDoc.data();
    const notes: NoteType[] = noteData.notes;
    const noteIndex = notes.findIndex((note) => note.uid === note_id);
    notes.splice(noteIndex, 1);
    await updateDoc(noteRef, { notes });
    redirect('/');
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className='dark bg-black border-red-500'>
        <AlertDialogHeader>
          <AlertDialogTitle>Are absolutly sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            note: <b>{noteName}</b> and remove all data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className='light'>Cancel</AlertDialogCancel>
          <form action={handleDeleteNote}>
            <AlertDialogAction
              name='button'
              type='submit'
              className='bg-red-600 focus:bg-red-700 hover:bg-red-700 active:bg-red-700 text-neutral-200 font-bold'
            >
              Delete Note
            </AlertDialogAction>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
