import { ReactNode } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Archive, ArchiveX, Pencil, Star, StarOff, Trash } from 'lucide-react';
import DeleteNoteDialog from './Note/DeleteNoteDialog';
import EditNoteDialog from './Note/EditNoteDialog';
import { currentUser, getNoteById } from '@/queries/note';
import { toggleNoteArchive, toggleNoteFavourite } from '@/actions/note';

import DropdownButton from './DropdownButton';
interface DropdownProps {
  children: ReactNode;
  noteId: string;
}

export default async function Dropdown({ children, noteId }: DropdownProps) {
  const user = await currentUser();
  const userId = user?.id;

  async function handleToggleFavourite() {
    'use server';
    if (!userId) return;
    await toggleNoteFavourite(noteId, userId);
  }

  async function handleToggleArchive() {
    'use server';
    if (!userId) return;
    await toggleNoteArchive(noteId, userId);
  }

  const note = await getNoteById(noteId);
  if (!note) return;

  const { id, title, colour, isFavourite, isArchived } = note;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent
        align='end'
        sideOffset={10}
        className='bg-night text-neutral-100 leading-none border-none w-36 flex flex-col p-0 my-1'
      >
        <form action={handleToggleFavourite}>
          <DropdownButton
            disabled={isArchived}
            active={isFavourite}
            color='favourite'
            text={isFavourite ? 'Unfavourite' : 'Favourite'}
            icon={isFavourite ? <StarOff /> : <Star />}
          />
        </form>
        <form action={handleToggleArchive}>
          <DropdownButton
            icon={isArchived ? <ArchiveX /> : <Archive />}
            color='archive'
            text={isArchived ? 'Unarchive' : 'Archive'}
            disabled={isFavourite}
            active={isArchived}
          />
        </form>
        <EditNoteDialog noteId={id} noteName={title} noteColour={colour}>
          <DropdownButton icon={<Pencil />} color='edit' />
        </EditNoteDialog>
        <DeleteNoteDialog noteName={title} noteId={id}>
          <DropdownButton color='delete' icon={<Trash />} />
        </DeleteNoteDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
