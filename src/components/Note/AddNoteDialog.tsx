'use client';

import { ReactNode, useState, useTransition } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/ui/dialog';
import { Input } from '@/ui/input';
import ColourSelect from '../ColourSelect';
import { createNote } from '@/actions/note';
import { z } from 'zod';
import { noteDialogSchema } from '@/schemas';
import { useForm, useWatch } from 'react-hook-form';
import useKeyboardShortcut from 'use-keyboard-shortcut';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/ui/form';
import { Button } from '@/ui/button';
import { ColourType, Colours } from '@/utils/colours';
import { Loader2 } from 'lucide-react';

interface AddNoteDialogProps {
  children: ReactNode;
}

export type NoteDialog = z.infer<typeof noteDialogSchema>;

export default function AddNoteDialog({ children }: AddNoteDialogProps) {
  const [loading, startTransition] = useTransition();
  const [open, setOpen] = useState<boolean>(false);
  const {} = useKeyboardShortcut(
    ['Control', 'E'],
    (shortcutKey) => {
      setOpen(true);
    },
    { overrideSystem: true, repeatOnHold: false },
  );

  function handleAddNote(values: NoteDialog) {
    startTransition(async () => {
      await createNote(values);
      setOpen(false);
    });
  }

  const noteDialog = useForm<NoteDialog>({
    resolver: zodResolver(noteDialogSchema),
    defaultValues: {
      colour: 'random',
    },
  });

  const colour = useWatch({
    control: noteDialog.control,
    name: 'colour',
  }) as ColourType;
  const selectedColour = Colours[colour];

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='dark bg-black w-96'>
        <Form {...noteDialog}>
          <form
            onSubmit={noteDialog.handleSubmit(handleAddNote)}
            className='flex flex-col gap-3'
          >
            <DialogHeader className='flex flex-col gap-3'>
              <DialogTitle>Add New Note</DialogTitle>
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
                        disabled={loading}
                        type='text'
                        className='bg-black dark col-span-3 focus:ring-transparent focus:outline'
                        style={{ outlineColor: selectedColour }}
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
                      colour={selectedColour}
                      disabled={loading}
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
              <Button
                disabled={loading}
                style={{ backgroundColor: selectedColour }}
                size='sm'
                type='submit'
                className='transition-colors duration-200 ease-in flex gap-1 items-center'
              >
                Create note
                {loading && <Loader2 size={16} className='animate-spin' />}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
