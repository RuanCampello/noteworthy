import { ReactNode } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent, DropdownMenuTrigger
} from './ui/dropdown-menu';
import { Archive, Pencil, Star, StarOff, Trash } from 'lucide-react';
import { Separator } from './ui/separator';
import DeleteNoteDialog from './Note/DeleteNoteDialog';
import EditNoteDialog from './Note/EditNoteDialog';
import { currentUser, getNoteById, isNoteFavourite } from '@/data/note';
import { toggleNoteFavourite } from '@/actions/note';

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

  const note = await getNoteById(noteId);
  if (!note) return;

  const { id, title, colour } = note;
  const favourite = await isNoteFavourite(noteId);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent
        align='end'
        sideOffset={10}
        className='bg-night text-neutral-100 border-none gap-1.5 w-44 flex flex-col p-1.5 rounded-md'
      >
        <form action={handleToggleFavourite}>
          <DropdownButton
            active={favourite}
            color='favourite'
            text={favourite ? 'Unfavourite' : 'Favourite'}
            icon={favourite ? <StarOff /> : <Star />}
          />
        </form>
        <DropdownButton icon={<Archive />} text='Archive' color='archive' />
        <EditNoteDialog noteId={id} noteName={title} noteColour={colour}>
          <DropdownButton text='Edit' icon={<Pencil />} color='edit' />
        </EditNoteDialog>
        <Separator className='bg-silver' />
        <DeleteNoteDialog noteName={title} noteId={id}>
          <DropdownButton color='delete' icon={<Trash />} text='Delete' />
        </DeleteNoteDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
