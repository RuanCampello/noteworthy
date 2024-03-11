import { ReactNode } from 'react';
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
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { getRandomColour } from '@/utils/colours';
import { addNote } from '@/utils/api';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import AddNoteSubmit from './AddNoteSubmit';

interface AddNoteDialogProps {
  children: ReactNode;
}

export default function AddNoteDialog({ children }: AddNoteDialogProps) {
  const user_id = cookies().get('user_id')?.value;

  async function handleAddNote(formData: FormData) {
    'use server';
    const name = formData.get('name') as string;
    const colour = formData.get('colour') as string;
    const colourName = colour === 'random' ? getRandomColour().name : colour;

    if (user_id) {
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
      cookies().set('open_note', uid);

      const header = headers().get('pathname');
      //redirect the user based on its pathname (in some notes or in home)
      if (header?.includes('notes')) redirect(uid);
      else redirect(`/notes/${uid}`);
    }
  }
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='dark bg-black w-96'>
        <form action={handleAddNote} className='flex flex-col gap-3'>
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
            <Input
              required
              minLength={4}
              id='name'
              name='name'
              className='col-span-3 dark bg-black invalid:focus:outline-red-600'
            />
          </div>
          <div className='grid grid-cols-4 gap-4 items-center'>
            <Label className='text-base text-right'>Colour</Label>
            <ColourSelect defaultColour={'random'} />
          </div>
          <DialogFooter>
            <AddNoteSubmit text='Create note' />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
