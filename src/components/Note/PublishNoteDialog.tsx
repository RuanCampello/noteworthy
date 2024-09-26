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
import { togglePublishState } from '@/actions';
import { headers } from 'next/headers';
import SubmitButton from '@/components/SubmitButton';
import { Globe } from 'lucide-react';
import ShareLinkButton from '@/components/ShareLinkButton';
import DropdownButton from '@/components/DropdownButton';
import { getNoteIsPublic } from '@/actions';
import { getTranslations } from 'next-intl/server';

interface DialogContentProps {
  title: string;
  description: string;
  actionName: string;
}

type DialogKey = 'public' | 'private';

export default async function PublishNoteDialog() {
  const t = await getTranslations('Publish');

  const dialogContent: Record<DialogKey, DialogContentProps> = {
    private: {
      title: t('title'),
      description: t('description'),
      actionName: t('pub'),
    },
    public: {
      title: t('unpub_title'),
      description: t('unpub_description'),
      actionName: t('unpub'),
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

    console.log('is public: ', isPublic);
    if (isPublic === null) return;
    await togglePublishState(noteId);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <DropdownButton
          icon={<Globe />}
          color='publish'
          text={isPublic ? t('unpub') : t('pub')}
        />
      </DialogTrigger>
      <DialogContent className='w-96 bg-black dark select-none'>
        <form className='overflow-x-hidden' action={handleTogglePublishState}>
          <DialogHeader>
            <DialogTitle>{dialogContent[dialogKey].title}</DialogTitle>
            <DialogDescription
              data-global={isPublic}
              className='data-[global=true]:text-wisteria data-[global=true]:flex data-[global=true]:gap-1 data-[global=true]:items-center text-[13px]'
            >
              {isPublic && <Globe size={16} />}
              {dialogContent[dialogKey].description}
            </DialogDescription>
          </DialogHeader>
          {isPublic && <ShareLinkButton noteId={noteId} />}
          <DialogFooter className='grid grid-cols-2 mt-6 p-1'>
            <DialogClose asChild>
              <Button type='button' size='sm' variant='secondary'>
                {t('cancel')}
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
