'use client';

import { editNote } from '@/actions/note';
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
import { type ColourType, Colours } from '@/utils/colours';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { type ReactNode, useState, useTransition } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import ColourSelect from '../ColourSelect';
import { NoteDialog } from './AddNoteDialog';

interface EditNoteDialogProps {
  children: ReactNode;
  noteName: string;
  noteColour: ColourType;
  noteId: string;
}

export default function EditNoteDialog({
  children,
  noteName,
  noteColour,
  noteId,
}: EditNoteDialogProps) {
  const [loading, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const t = useTranslations('Edit');
  const noteDialog = useForm<NoteDialog>({
    resolver: zodResolver(noteDialogSchema),
    defaultValues: {
      name: noteName,
      colour: noteColour,
    },
  });

  function handleEditNote(values: NoteDialog) {
    startTransition(async () => {
      await editNote(values, noteId);
      setOpen(false);
    });
  }

  const colour = useWatch({
    control: noteDialog.control,
    name: 'colour',
  }) as ColourType;
  const selectedColour = Colours[colour];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className='dark bg-black w-96'>
        <Form {...noteDialog}>
          <form
            onSubmit={noteDialog.handleSubmit(handleEditNote)}
            className='flex flex-col gap-3'
          >
            <DialogHeader className='flex flex-col gap-3'>
              <DialogTitle className='flex gap-2'>
                {t('title')}{' '}
                <p
                  title={noteName}
                  className='text-silver line-clamp-1'
                >{`"${noteName}"`}</p>
              </DialogTitle>
              <DialogDescription>{t('description')}</DialogDescription>
            </DialogHeader>
            <FormField
              control={noteDialog.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <div className='grid grid-cols-4 gap-4 items-center'>
                    <FormLabel className='text-base text-neutral-200 text-right'>
                      {t('field_name')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        style={{ outlineColor: selectedColour }}
                        type='text'
                        className='bg-black dark col-span-3 focus:outline focus:ring-transparent'
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
                    {t('field_colour')}
                  </FormLabel>
                  <FormControl>
                    <ColourSelect
                      colour={selectedColour}
                      onValueChange={field.onChange}
                      defaultColour={noteColour}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                style={{ backgroundColor: selectedColour }}
                disabled={loading}
                size='sm'
                type='submit'
              >
                {t('button')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
