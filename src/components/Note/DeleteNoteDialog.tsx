'use client';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/ui/alert-dialog';
import { type ReactNode, useTransition } from 'react';

import { deleteNote } from '@/actions';
import { Button } from '@/ui/button';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

interface DeleteNoteDialogProps {
  children: ReactNode;
}

export default function DeleteNoteDialog({ children }: DeleteNoteDialogProps) {
  const [loading, startTransition] = useTransition();
  const t = useTranslations('Delete');
  const id = useParams<{ id: string }>().id;

  function handleDeleteNote() {
    startTransition(async () => {
      await deleteNote(id);
    });
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger>{children}</AlertDialogTrigger>
      <AlertDialogContent className='dark bg-black border-red-500 w-96'>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('title')}</AlertDialogTitle>
          <AlertDialogDescription>{t('description')}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button
              size='sm'
              className='h-fit bg-secondary text-sm text-secondary-foreground hover:bg-secondary/80'
            >
              {t('cancel')}
            </Button>
          </AlertDialogCancel>
          <Button
            disabled={loading}
            variant='destructive'
            size='sm'
            onClick={handleDeleteNote}
          >
            {t('button')}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
