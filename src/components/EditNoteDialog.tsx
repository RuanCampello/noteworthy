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
import { cookies } from 'next/headers';
import { ColourType, getRandomColour } from '@/utils/colours';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { NoteType } from '@/types/note-type';
import { redirect } from 'next/navigation';

interface EditNoteDialogProps {
  children: ReactNode;
  noteName: string;
  noteColour: 'random' | ColourType
}

export default async function EditNoteDialog({
  children,
  noteName,
  noteColour
}: EditNoteDialogProps) {
  const user_id = cookies().get('user_id')?.value;
  const openNote = cookies().get('open_note')?.value;
  async function editNote(formData: FormData) {
    'use server';
    const name = formData.get('name') as string;
    const colour = formData.get('colour') as ColourType;
    const colourName =
      colour.toString() === 'random'
        ? (getRandomColour().name as ColourType)
        : colour;

    if (user_id && openNote) {
      const response = await getDoc(doc(db, 'userNotes', user_id));
      const data = response.data();
      if (!data) return;
      const notes: NoteType[] = data['notes'];
      if (!notes) return;
      const note = notes.find((note) => note.uid === openNote);
      if (!note) return;
      const { uid, date, content, owner } = note;
      const updatedNotes = notes.filter((note) => note.uid !== openNote);
      updatedNotes.push({
        uid: uid,
        date: date,
        content: content,
        owner: owner,
        title: name,
        colour: colourName,
      });
      await setDoc(doc(db, 'userNotes', user_id), { notes: updatedNotes });
      redirect(uid);
    }
  }
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='dark bg-black w-96'>
        <form action={editNote} className='flex flex-col gap-3'>
          <DialogHeader className='flex flex-col gap-3'>
            <DialogTitle className='flex gap-2'>
              Edit <h1 className='text-silver'>{`"${noteName}"`}</h1>
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
