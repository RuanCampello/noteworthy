'use client';

import {
  getNote,
  toggleNoteArchive,
  toggleNoteFavourite,
} from '@/actions/note';
import DropdownButton from '@/components/DropdownButton';
import type { Note } from '@/types/database-types';
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
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import {
  type ReactNode,
  useCallback,
  useEffect,
  useState,
  useTransition,
} from 'react';
import DeleteNoteDialog from './DeleteNoteDialog';
import EditNoteDialog from './EditNoteDialog';

interface DropdownProps {
  children: ReactNode;
}

export default function Dropdown({ children }: DropdownProps) {
  const { data: session } = useSession();
  const [favouriteLoading, startFavouriteTransition] = useTransition();
  const [archiveLoading, startArchiveTransition] = useTransition();
  const userId = session?.user?.id;
  const params = useParams<{ id: string }>();
  const noteId = params.id;
  const [note, setNote] = useState<Note>();
  const t = useTranslations('NoteDropdown');

  const fetchNote = useCallback(async () => {
    if (!noteId) return;
    const note = await getNote(noteId);
    if (note) setNote(note);
  }, [noteId]);

  useEffect(() => {
    fetchNote();
  }, [fetchNote]);

  function handleToggleFavourite() {
    if (!userId || !noteId) return;
    startFavouriteTransition(async () => {
      await toggleNoteFavourite(noteId, userId);
    });
  }

  function handleToggleArchive() {
    if (!userId || !noteId) return;
    startArchiveTransition(async () => {
      await toggleNoteArchive(noteId, userId);
    });
  }

  if (!note) return;
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
            active={!!isFavourite}
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
            active={!!isArchived}
          />
        </form>
        <EditNoteDialog
          noteId={id}
          noteName={title}
          noteColour={colour}
          callback={fetchNote}
        >
          <DropdownButton text={t('edit')} icon={<Pencil />} color='edit' />
        </EditNoteDialog>
        {children}
        <DeleteNoteDialog noteName={title} noteId={id}>
          <DropdownButton text={t('del')} color='delete' icon={<Trash />} />
        </DeleteNoteDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
