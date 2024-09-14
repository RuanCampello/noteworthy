'use client';

import { toggleNoteFavourite, toggleNoteArchived } from '@/actions';
import DropdownButton from '@/components/DropdownButton';
import type { Note } from '@/types/Note';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/ui/dropdown-menu';
import {
  Archive,
  ArchiveX,
  MoreHorizontal,
  Pencil,
  Star,
  StarOff,
  Trash,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { type ReactNode, useTransition } from 'react';
import type { Colour } from '@/types/Enums';
import DeleteNoteDialog from './DeleteNoteDialog';
import EditNoteDialog from './EditNoteDialog';

interface DropdownProps {
  children: ReactNode;
  note: Note;
}

export default function Dropdown({ note, children }: DropdownProps) {
  const [favouriteLoading, startFavouriteTransition] = useTransition();
  const [archiveLoading, startArchiveTransition] = useTransition();
  const t = useTranslations('NoteDropdown');

  function handleToggleFavourite() {
    startFavouriteTransition(async () => {
      await toggleNoteFavourite(note.id);
    });
  }

  function handleToggleArchive() {
    startArchiveTransition(async () => {
      await toggleNoteArchived(note.id);
    });
  }

  const { id, title, colour, isFavourite, isArchived } = note;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className='h-fit focus:rounded-full focus:outline-offset-2 p-2 border-2 border-white/60 text-white/60 hover:text-neutral-200 hover:border-neutral-100 rounded-full focus:outline-none shrink-0 transition-colors duration-200'>
          <MoreHorizontal size={18} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='end'
        sideOffset={10}
        className='bg-night text-neutral-100 leading-none border-none w-36 flex flex-col p-0 my-1'
      >
        <form action={handleToggleFavourite}>
          <DropdownButton
            loading={favouriteLoading}
            disabled={isArchived || favouriteLoading}
            active={isFavourite}
            color='favourite'
            text={isFavourite ? t('unfav') : t('fav')}
            icon={isFavourite ? <StarOff /> : <Star />}
          />
        </form>
        <form action={handleToggleArchive}>
          <DropdownButton
            loading={archiveLoading}
            icon={isArchived ? <ArchiveX /> : <Archive />}
            color='archive'
            text={isArchived ? t('unarc') : t('arc')}
            disabled={isFavourite || archiveLoading}
            active={isArchived}
          />
        </form>
        <EditNoteDialog
          noteId={id}
          noteName={title}
          noteColour={colour as Colour}
        >
          <DropdownButton text={t('edit')} icon={<Pencil />} color='edit' />
        </EditNoteDialog>
        {children}
        <DeleteNoteDialog>
          <DropdownButton text={t('del')} color='delete' icon={<Trash />} />
        </DeleteNoteDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
