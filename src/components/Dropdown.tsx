import { ReactNode } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Archive, Pencil, Star } from 'lucide-react';
import { Separator } from './ui/separator';
import DeleteNoteDialog from './DeleteNoteDialog';
import SubmitButton from './SubmitButton';
import EditNoteDialog from './EditNoteDialog';
import { currentUser, getNoteById, isNoteFavourite } from '@/data/note';
import { toggleNoteFavourite } from '@/actions/note';
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
  const iconStyle =
    'group-active:scale-95 transition-transform duration-200';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent
        align='end'
        sideOffset={14}
        className='bg-night text-neutral-100 border-none gap-3 w-52 flex flex-col p-3 rounded-md'
      >
        <DropdownMenuItem
          className={`text-base active:bg-sunset focus:bg-sunset hover:bg-sunset active:text-black group ${
            favourite &&
            'bg-sunset active:bg-sunset/85 focus:bg-sunset/85 text-black'
          }`}
        >
          {favourite ? (
            <form className='w-full' action={handleToggleFavourite}>
              <SubmitButton>
                <Star fill='#333333' className={iconStyle} size={20} />
                Unfavourite
              </SubmitButton>
            </form>
          ) : (
            <form className='w-full' action={handleToggleFavourite}>
              <SubmitButton>
                <Star size={20} className={iconStyle} />
                Favourite
              </SubmitButton>
            </form>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem className='gap-3 text-base focus:bg-mindaro active:bg-mindaro active:text-black group'>
          <Archive size={20} className={iconStyle} />
          Archive
        </DropdownMenuItem>
        <EditNoteDialog noteId={id} noteName={title} noteColour={colour}>
          <button className='gap-3 flex p-2 items-center rounded-sm text-base active:text-black active:bg-tiffany focus:bg-tiffany focus:text-black focus:outline-none hover:bg-tiffany hover:text-black group'>
            <Pencil size={20} className={iconStyle} />
            Edit
          </button>
        </EditNoteDialog>
        <Separator className='bg-white/40' />
        {/* <DeleteNoteDialog noteName={name}>
          <button className='gap-3 flex p-2 items-center rounded-sm text-base active:text-black active:bg-melon focus:bg-melon focus:text-black focus:outline-none hover:bg-melon hover:text-black group'>
            <Trash
              size={20}
              className='group-hover:scale-110 transition-transform duration-200 group-active:scale-95'
            />
            <span>Delete</span>
          </button>
        </DeleteNoteDialog> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
