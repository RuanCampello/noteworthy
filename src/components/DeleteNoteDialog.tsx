import { ReactNode } from 'react';
import {
  AlertDialog, AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from './ui/alert-dialog';
import { cookies } from 'next/headers';
import DeleteNoteSubmit from './DeleteNoteSubmit';

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
    //todo
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
            <DeleteNoteSubmit />
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
