'use client';

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
import ColourSelect from './ColourSelect';
import AddNoteSubmit from './AddNoteSubmit';
import { createNote } from '@/actions/note';
import { z } from 'zod';
import { noteDialogSchema } from '@/schemas';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';

interface AddNoteDialogProps {
  children: ReactNode;
}

type NoteDialog = z.infer<typeof noteDialogSchema>;

export default function AddNoteDialog({ children }: AddNoteDialogProps) {
  async function handleAddNote(values: NoteDialog) {
    await createNote(values);
  }

  const noteDialog = useForm<NoteDialog>({
    resolver: zodResolver(noteDialogSchema),
    defaultValues: {
      colour: 'random',
    },
  });
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='dark bg-black w-96'>
        <Form {...noteDialog}>
          <form
            onSubmit={noteDialog.handleSubmit(handleAddNote)}
            className='flex flex-col gap-3'
          >
            <DialogHeader className='flex flex-col gap-3'>
              <DialogTitle className='text-2xl'>Add New Note</DialogTitle>
              <DialogDescription>
                📝 Ready to capture a spark of inspiration? Create your note,
                let your thoughts soar, and sprinkle some magic into your
                digital world. Let&apos;s write wonders together! ✨
              </DialogDescription>
            </DialogHeader>
            <FormField
              control={noteDialog.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <div className='grid grid-cols-4 gap-4 items-center'>
                    <FormLabel className='text-base text-neutral-200 text-right'>
                      Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        type='text'
                        className='bg-black dark col-span-3'
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name='colour'
              control={noteDialog.control}
              render={({ field }) => (
                <FormItem className='grid grid-cols-4 gap-4 items-center'>
                  <FormLabel className='text-base text-neutral-200 text-right'>
                    Colour
                  </FormLabel>
                  <FormControl>
                    <ColourSelect
                      onValueChange={field.onChange}
                      defaultColour={'random'}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <AddNoteSubmit text='Create note' />
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
