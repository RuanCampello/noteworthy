'use client';

import { FormEvent, ReactNode } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import ColourSelect from './ColourSelect';
import { getCookie, setCookie } from 'cookies-next';
import {
  Timestamp,
  arrayUnion,
  doc,
  getDoc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '@/firebase';
import { getRandomColour } from '@/utils/colours';
import { v4 as uuid } from 'uuid';
import { addNote } from '@/utils/add-note';
import { useRouter } from 'next/navigation';

interface AddNoteDialogProps {
  children: ReactNode;
}

export default function AddNoteDialog({ children }: AddNoteDialogProps) {
  const user_id = getCookie('user_id');
  const router = useRouter();

  async function handleAddNote(e: any) {
    e.preventDefault();

    const name = e.target.name.value;
    const colour = e.target.colour.value;
    const colourName = colour === 'random' ? getRandomColour().name : colour;

    if (user_id) {
      try {
        const response = await getDoc(doc(db, 'users', user_id));
        const data = response.data();
        if (!data) return;
        const username = data['name'];
        const uid = await addNote({
          userId: user_id,
          title: name,
          content: '',
          owner: username,
          colour: colourName,
        });
        setCookie('open_note', uid);
        router.push(uid);
      } catch (error) {
        console.error(error);
      }
    }
  }
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='dark bg-black w-96'>
        <form
          onSubmit={(e) => handleAddNote(e)}
          className='flex flex-col gap-3'
        >
          <DialogHeader className='flex flex-col gap-3'>
            <DialogTitle className='text-2xl'>Add New Note</DialogTitle>
            <DialogDescription>
              📝 Ready to capture a spark of inspiration? Create your note, let
              your thoughts soar, and sprinkle some magic into your digital
              world. Let&apos;s write wonders together! ✨
            </DialogDescription>
          </DialogHeader>
          <div className='grid grid-cols-4 gap-4 items-center'>
            <Label htmlFor='name' className='text-base text-right'>
              Name
            </Label>
            <Input id='name' className='col-span-3 dark bg-black' />
          </div>
          <div className='grid grid-cols-4 gap-4 items-center'>
            <Label className='text-base text-right'>Colour</Label>
            <ColourSelect />
          </div>
          <DialogFooter>
            <button
              className='p-2 px-3 bg-night hover:bg-midnight transition-colors font-medium rounded-lg'
              type='submit'
            >
              Create note
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
