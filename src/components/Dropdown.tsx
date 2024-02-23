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
import { NoteType } from '@/types/note-type';
import { arrayUnion, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

interface DropdownProps {
  children: ReactNode;
  noteId: string;
}

export default function Dropdown({ children, noteId }: DropdownProps) {
  const user_id = cookies().get('user_id')?.value;
  async function addFavourites() {
    'use server';
    if (!user_id || !noteId) return;
    const noteRef = doc(db, 'userNotes', user_id);
    const noteDoc = await getDoc(noteRef);
    if (!noteDoc.exists()) return;
    const noteData = noteDoc.data();
    const notes: NoteType[] = noteData.notes;
    const noteIndex = notes.findIndex((note) => note.uid === noteId);
    const note = notes[noteIndex]
    await updateDoc(noteRef, { notes });
    await setDoc(doc(db, 'userFavourites', user_id), {})
    await updateDoc(doc(db, 'userFavourites', user_id), {
      notes: arrayUnion({
        uid: note.uid,
        title: note.title,
        owner: note.owner,
        colour: note.colour,
        content: note.content,
        date: note.date
      })
    })
    notes.splice(noteIndex, 1);
    await updateDoc(noteRef, { notes });
    redirect(`/favourites/${note.uid}`);
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent
        align='end'
        sideOffset={14}
        className='bg-night text-neutral-100 border-none gap-3 w-52 flex flex-col p-3 rounded-md'
      >
        <DropdownMenuItem className='text-base active:bg-sunset group'>
          <form action={addFavourites}>
            <button type='submit' className='w-full flex items-center gap-3'>
              <Star
                size={20}
                className='group-hover:scale-105 transition-transform duration-200 group-active:scale-95'
              />
              Favourite
            </button>
          </form>
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
