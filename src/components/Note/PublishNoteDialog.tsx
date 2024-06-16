import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/ui/dialog';
import { Button } from '@/ui/button';
import { tooglePublishState } from '@/server/actions/note';
import { ReactNode } from 'react';
import { headers } from 'next/headers';
import SubmitButton from '../SubmitButton';

interface PublishNoteDialogProps {
  children: ReactNode;
  isPublic: boolean;
}

interface DialogContentProps {
  title: string;
  description: string;
  actionName: string;
}

type DialogKey = 'public' | 'private';

export default function PublishNoteDialog({
  children,
  isPublic,
}: PublishNoteDialogProps) {
  const dialogContent: Record<DialogKey, DialogContentProps> = {
    private: {
      title: 'Publish this note',
      description:
        "Ready to ignite your ideas? Share your note with the world, let your creativity shine. Let's publish brilliance together! 🚀",
      actionName: 'Publish',
    },
    public: {
      title: 'Unpublish this note',
      description:
        'Ready to reclaim your thoughts? Unpublish your note, keep your ideas close, and let your creativity simmer in private. 🔒',
      actionName: 'Unpublish',
    },
  };
  const dialogKey: DialogKey = isPublic ? 'public' : 'private';

  async function handleTogglePublishState() {
    'use server';

    const headerList = headers();
    const pathname = headerList.get('pathname');
    if (!pathname) return;

    const noteId = pathname.replace(/\/[^/]*\//g, '');
    await tooglePublishState(noteId, isPublic);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='w-96 bg-black dark'>
        <form action={handleTogglePublishState}>
          <DialogHeader>
            <DialogTitle>{dialogContent[dialogKey].title}</DialogTitle>
            <DialogDescription>
              {dialogContent[dialogKey].description}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className='grid grid-cols-2 mt-6'>
            <DialogClose asChild>
              <Button
                type='button'
                size='sm'
                variant='secondary'
              >
                Cancel
              </Button>
            </DialogClose>
            <SubmitButton
              size='sm'
              variant='default'
              type='submit'
            >
              {dialogContent[dialogKey].actionName}
            </SubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
