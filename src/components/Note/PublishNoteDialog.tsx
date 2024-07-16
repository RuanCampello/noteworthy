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
import DropdownButton from '../DropdownButton';
import { getNoteIsPublic } from '@/server/queries/note';

interface DialogContentProps {
  title: string;
  description: string;
  actionName: string;
}

type DialogKey = 'public' | 'private';

export default async function PublishNoteDialog() {
  const dialogContent: Record<DialogKey, DialogContentProps> = {
    private: {
      title: 'Publish this note',
      description:
        "Ready to ignite your ideas? Share your note with the world, let your creativity shine. Let's publish brilliance together! 🚀",
      actionName: 'Publish',
    },
    public: {
      title: 'Unpublish this note',
      description: 'Anyone who has this link will be able to view the note.',
      actionName: 'Unpublish',
    },
  };
  const headerList = headers();
  const pathname = headerList.get('pathname');
  if (!pathname) return;

  const noteId = pathname.replace(/\/[^/]*\//g, '');
  const isPublic = await getNoteIsPublic(noteId);

  const dialogKey: DialogKey = isPublic ? 'public' : 'private';

  async function handleTogglePublishState() {
    'use server';

    if (isPublic === null) return;
    await tooglePublishState(noteId, isPublic);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <DropdownButton
          icon={<Globe />}
          color='publish'
          text={isPublic ? 'Unpublish' : 'Publish'}
        />
      </DialogTrigger>
      <DialogContent className='w-96 bg-black dark select-none'>
        <form className='overflow-x-hidden' action={handleTogglePublishState}>
          <DialogHeader>
            <DialogTitle>{dialogContent[dialogKey].title}</DialogTitle>
            <DialogDescription
              data-global={isPublic}
              className='data-[global=true]:text-wisteria data-[global=true]:flex data-[global=true]:gap-1 data-[global=true]:items-center'
            >
              {isPublic && <Globe size={16} />}
              {dialogContent[dialogKey].description}
            </DialogDescription>
          </DialogHeader>
          {isPublic && <ShareLinkButton noteId={noteId} />}
          <DialogFooter className='grid grid-cols-2 mt-6 p-1'>
            <DialogClose asChild>
              <Button type='button' size='sm' variant='secondary'>
                Cancel
              </Button>
            </DialogClose>
            <SubmitButton size='sm' variant='default' type='submit'>
              {dialogContent[dialogKey].actionName}
            </SubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
