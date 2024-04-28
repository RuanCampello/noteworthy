'use client';

import { ReactNode, useTransition } from 'react';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';

import { deleteNote } from '@/actions/note';
import { Button } from '../ui/button';

interface DeleteNoteDialogProps {
  children: ReactNode;
  noteName: string;
  noteId: string;
}

export default function DeleteNoteDialog({
  children,
  noteName,
  noteId,
}: DeleteNoteDialogProps) {
  const [loading, startTransition] = useTransition();
  function handleDeleteNote() {
    startTransition(async () => {
      await deleteNote(noteId);
    });
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
          <Button
            disabled={loading}
            variant='destructive'
            size='sm'
            onClick={handleDeleteNote}
          >
            Delete note
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
