'use client';

import { createNote } from '@/actions/note';
import { noteDialogSchema } from '@/schemas';
import { Button } from '@/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/ui/form';
import { Input } from '@/ui/input';
import { Colours } from '@/utils/colours';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { type ReactNode, useState, useTransition } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useHotkeys } from 'react-hotkeys-hook';
import { z } from 'zod';
import type { Colour } from '../../types/database-types';
import ColourSelect from '../ColourSelect';

interface AddNoteDialogProps {
  children: ReactNode;
}

export type NoteDialog = z.infer<typeof noteDialogSchema>;

export default function AddNoteDialog({ children }: AddNoteDialogProps) {
  const [loading, startTransition] = useTransition();
  const [open, setOpen] = useState<boolean>(false);
  const t = useTranslations('AddNote');

  useHotkeys(['ctrl+e'], () => setOpen(true), {
    preventDefault: true,
    enableOnFormTags: true,
    enableOnContentEditable: true,
  });

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
  }) as Colour;
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
              <DialogTitle>{t('title')}</DialogTitle>
              <DialogDescription>{t('description')}</DialogDescription>
            </DialogHeader>
            <FormField
              control={noteDialog.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <div className='grid grid-cols-4 gap-4 items-center'>
                    <FormLabel className='text-base text-neutral-200 text-right'>
                      {t('name_field')}
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
                <FormItem className='grid grid-cols-4 gap-4 items-center space-y-0'>
                  <FormLabel className='text-base text-neutral-200 text-right'>
                    {t('colour_field')}
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
                {t('button')}
                {loading && <Loader2 size={16} className='animate-spin' />}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
