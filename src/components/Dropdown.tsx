import { ReactNode } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Archive, Star, Trash } from 'lucide-react';
import { Separator } from './ui/separator';
import DeleteNoteDialog from './DeleteNoteDialog';
import { db } from '@/firebase';
import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import findNote from '@/utils/find-note';
import getNotes from '@/utils/get-notes';
interface DropdownProps {
  children: ReactNode;
  noteId: string;
}

export default async function Dropdown({ children, noteId }: DropdownProps) {
  const user_id = cookies().get('user_id')?.value;
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
    console.log(`${title} favourited!`);
    await updateDoc(doc(db, 'userNotes', user_id), { notes });
    redirect(`/favourites/${note.uid}`);
  }
  async function isFavourite() {
    if (!user_id) return;
    const favouriteNote = await findNote(user_id, 'userFavourites', noteId);
    if (favouriteNote) return true;
    else return false;
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
  const favourite = await isFavourite();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent
        align='end'
        sideOffset={14}
        className='bg-night text-neutral-100 border-none gap-3 w-52 flex flex-col p-3 rounded-md'
      >
        <DropdownMenuItem
          className={`text-base active:bg-sunset group ${
            favourite && 'bg-sunset focus:bg-sunset text-black'
          }`}
        >
          {favourite ? (
            <form className='w-full' action={unfavourite}>
              <button type='submit' className='w-full flex items-center gap-3 focus:outline-none'>
                <Star />
                Unfavourite
              </button>
            </form>
          ) : (
            <form className='w-full' action={addFavourites}>
              <button type='submit' className='w-full flex items-center gap-3 focus:outline-none'>
                <Star
                  size={20}
                  className='group-hover:scale-105 transition-transform duration-200 group-active:scale-95'
                />
                Favourite
              </button>
            </form>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem className='gap-3 text-base active:bg-mindaro group'>
          <Archive
            size={20}
            className='group-hover:scale-105 transition-transform duration-200 group-active:scale-95'
          />
          Archive
        </DropdownMenuItem>
        <Separator className='bg-white/40' />
        <DeleteNoteDialog>
          <button className='gap-3 flex p-2 items-center rounded-sm text-base active:text-black active:bg-melon focus:bg-melon focus:text-black hover:bg-melon hover:text-black group'>
            <Trash
              size={20}
              className='group-hover:scale-105 transition-transform duration-200 group-active:scale-95'
            />
            <span>Delete</span>
          </button>
        </DeleteNoteDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
