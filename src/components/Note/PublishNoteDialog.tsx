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
import { Globe } from 'lucide-react';
import ShareLinkButton from '../ShareLinkButton';

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
      description: 'Anyone who has this link will be able to view this.',
      actionName: 'Unpublish',
    },
  };
  const dialogKey: DialogKey = isPublic ? 'public' : 'private';

  const headerList = headers();
  const pathname = headerList.get('pathname');
  if (!pathname) return;

  const noteId = pathname.replace(/\/[^/]*\//g, '');

  async function handleTogglePublishState() {
    'use server';

    await tooglePublishState(noteId, isPublic);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='w-96 bg-black dark select-none'>
        <form
          className='overflow-x-hidden p-1'
          action={handleTogglePublishState}
        >
          <DialogHeader>
            <DialogTitle>{dialogContent[dialogKey].title}</DialogTitle>
            <DialogDescription
              data-global={isPublic}
              className='data-[global=true]:text-wisteria data-[global=true]:flex data-[global=true]:gap-2 data-[global=true]:items-center'
            >
              {isPublic && <Globe size={16} />}
              {dialogContent[dialogKey].description}
            </DialogDescription>
          </DialogHeader>
          {isPublic && <ShareLinkButton noteId={noteId} />}
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