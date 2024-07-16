'use client';

import {
  type ReactNode,
  cache,
  useEffect,
  useState,
  useTransition,
} from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/ui/dropdown-menu';
import {
  Archive,
  ArchiveX,
  Loader2,
  MoreHorizontal,
  Pencil,
  Star,
  StarOff,
  Trash,
} from 'lucide-react';
import DeleteNoteDialog from './DeleteNoteDialog';
import EditNoteDialog from './EditNoteDialog';
import {
  getNote,
  toggleNoteArchive,
  toggleNoteFavourite,
} from '@/actions/note';
import DropdownButton from '@/components/DropdownButton';
import { useSession } from 'next-auth/react';
import { type Note } from '@prisma/client';
import { useParams } from 'next/navigation';

interface DropdownProps {
  children: ReactNode;
}

export default function Dropdown({ children }: DropdownProps) {
  const { data: session } = useSession();
  const [favouriteLoading, starFavouriteTransition] = useTransition();
  const [archiveLoading, startArchiveTransition] = useTransition();
  const userId = session?.user?.id;
  const params = useParams<{ id: string }>();
  const noteId = params.id;
  const [note, setNote] = useState<Note>();

  useEffect(() => {
    const fetchNote = cache(async () => {
      if (!noteId) return;
      const note = await getNote(noteId);
      if (note) setNote(note);
    });
    fetchNote();
  }, [noteId]);

  function handleToggleFavourite() {
    if (!userId || !noteId) return;
    starFavouriteTransition(async () => {
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
            active={isFavourite}
            color='favourite'
            text={isFavourite ? 'Unfavourite' : 'Favourite'}
            icon={isFavourite ? <StarOff /> : <Star />}
          />
        </form>
        <form action={handleToggleArchive}>
          <DropdownButton
            loading={archiveLoading}
            icon={isArchived ? <ArchiveX /> : <Archive />}
            color='archive'
            text={isArchived ? 'Unarchive' : 'Archive'}
            disabled={isFavourite || archiveLoading}
            active={isArchived}
          />
        </form>
        <EditNoteDialog noteId={id} noteName={title} noteColour={colour}>
          <DropdownButton icon={<Pencil />} color='edit' />
        </EditNoteDialog>
        {children}
        <DeleteNoteDialog noteName={title} noteId={id}>
          <DropdownButton color='delete' icon={<Trash />} />
        </DeleteNoteDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
