import { ReactNode } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Archive, Pencil, Star, Trash } from 'lucide-react';
import { Separator } from './ui/separator';
import DeleteNoteDialog from './DeleteNoteDialog';
import { db } from '@/firebase';
import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { findNote, getNotes } from '@/utils/api';
import SubmitButton from './SubmitButton';
import EditNoteDialog from './EditNoteDialog';
import { ColourType } from '@/utils/colours';
interface DropdownProps {
  children: ReactNode;
  noteId: string;
}

export default async function Dropdown({ children, noteId }: DropdownProps) {
  const user_id = cookies().get('user_id')?.value;

  // server actions
  async function addFavourites() {
    'use server';
    if (!user_id || !noteId) return;
    const notes = await getNotes(user_id, 'userNotes');
    if (!notes) return;
    const noteIndex = notes.findIndex((note) => note.uid === noteId);
    const note = notes[noteIndex];
    const { uid, title, owner, colour, content, date } = note;
    await updateDoc(doc(db, 'userFavourites', user_id), {
      notes: arrayUnion({
        uid: uid,
        title: title,
        owner: owner,
        colour: colour,
        content: content,
        date: date,
      }),
    });
    notes.splice(noteIndex, 1);
    await updateDoc(doc(db, 'userNotes', user_id), { notes });
    redirect(`/favourites/${note.uid}`);
  }
  async function unfavourite() {
    'use server';
    if (!user_id) return;
    const notes = await getNotes(user_id, 'userFavourites');
    if (!notes) return;
    const favouriteNoteIndex = notes.findIndex((note) => note.uid === noteId);
    const favouriteNote = notes[favouriteNoteIndex];
    const { uid, title, owner, colour, content, date } = favouriteNote;
    await updateDoc(doc(db, 'userNotes', user_id), {
      notes: arrayUnion({
        uid: uid,
        title: title,
        owner: owner,
        colour: colour,
        content: content,
        date: date,
      }),
    });
    notes.splice(favouriteNoteIndex, 1);
    await updateDoc(doc(db, 'userFavourites', user_id), { notes });
    redirect(`/notes/${favouriteNote.uid}`);
  }

  // firebase queries
  async function isFavourite(): Promise<boolean | null> {
    if (!user_id) return null;
    const favouriteNote = await findNote(user_id, 'userFavourites', noteId);
    if (favouriteNote) return true;
    else return false;
  }
  async function getNoteProps(): Promise<{
    name: string;
    colour: ColourType;
  } | null> {
    if (!user_id) return null;
    const pathname = headers().get('pathname');
    if (pathname?.includes('favourites')) {
      const note = await findNote(user_id, 'userFavourites', noteId);
      if (note) return { name: note.title, colour: note.colour };
      return null;
    } else {
      const note = await findNote(user_id, 'userNotes', noteId);
      if (note) return { name: note.title, colour: note.colour };
      return null;
    }
  }
  const favourite = await isFavourite();
  const noteProps = await getNoteProps();
  if (!noteProps) return;
  const { name, colour } = noteProps;
  const iconStyle =
    'group-active:scale-95 transition-transform group-hover:scale-110 group-focus:scale-110 duration-200';
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
            <form className='w-full' action={unfavourite}>
              <SubmitButton>
                <Star fill='#333333' className={iconStyle} size={20} />
                Unfavourite
              </SubmitButton>
            </form>
          ) : (
            <form className='w-full' action={addFavourites}>
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
        <EditNoteDialog noteName={name} noteColour={colour}>
          <button className='gap-3 flex p-2 items-center rounded-sm text-base active:text-black active:bg-tiffany focus:bg-tiffany focus:text-black focus:outline-none hover:bg-tiffany hover:text-black group'>
            <Pencil size={20} className={iconStyle} />
            Edit
          </button>
        </EditNoteDialog>
        <Separator className='bg-white/40' />
        <DeleteNoteDialog noteName={name}>
          <button className='gap-3 flex p-2 items-center rounded-sm text-base active:text-black active:bg-melon focus:bg-melon focus:text-black focus:outline-none hover:bg-melon hover:text-black group'>
            <Trash
              size={20}
              className='group-hover:scale-110 transition-transform duration-200 group-active:scale-95'
            />
            <span>Delete</span>
          </button>
        </DeleteNoteDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
