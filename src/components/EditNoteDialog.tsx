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
import { Input } from './ui/input';
import { Label } from './ui/label';
import ColourSelect from './ColourSelect';
import AddNoteSubmit from './AddNoteSubmit';
import { cookies, headers } from 'next/headers';
import { ColourType, getRandomColour } from '@/utils/colours';
import { redirect } from 'next/navigation';
import { OverrideNote } from '@/utils/api';
import { getCollection } from '@/utils/get-navigation-info';

interface EditNoteDialogProps {
  children: ReactNode;
  noteName: string;
  noteColour: 'random' | ColourType;
}

export default async function EditNoteDialog({
  children,
  noteName,
  noteColour,
}: EditNoteDialogProps) {
  const user_id = cookies().get('user_id')?.value;
  const openNote = cookies().get('open_note')?.value;
  const pathname = headers().get('pathname');
  if (!pathname) return;
  const collection = getCollection(pathname);

  async function editNote(formData: FormData) {
    'use server';
    const name = formData.get('name') as string;
    const colour = formData.get('colour') as ColourType;
    const colourName =
      colour.toString() === 'random'
        ? (getRandomColour().name as ColourType)
        : colour;

    if (user_id && openNote) {
      await OverrideNote(user_id, openNote, collection, {
        title: name,
        colour: colourName,
      });
      redirect(openNote);
    }
  }
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='dark bg-black w-96'>
        <form action={editNote} className='flex flex-col gap-3'>
          <DialogHeader className='flex flex-col gap-3'>
            <DialogTitle className='flex gap-2'>
              Edit <h1 title={noteName} className='text-silver line-clamp-1'>{`"${noteName}"`}</h1>
            </DialogTitle>
            <DialogDescription>
              📝 Let&apos;s capture inspiration and craft wonders together! Edit
              your note, let creativity soar! ✨
            </DialogDescription>
          </DialogHeader>
          <div className='grid grid-cols-4 gap-4 items-center'>
            <Label className='text-right text-base'>Name</Label>
            <Input
              required
              defaultValue={noteName}
              name='name'
              minLength={4}
              className='col-span-3 bg-black invalid:focus:outline-red-600'
            />
          </div>
          <div className='grid grid-cols-4 gap-4 items-center'>
            <Label className='text-base text-right'>Colour</Label>
            <ColourSelect defaultColour={noteColour} />
          </div>
          <DialogFooter>
            <AddNoteSubmit text='Edit note' />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
