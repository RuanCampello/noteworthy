'use client';

import { Bolt } from 'lucide-react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ToggleGroup, ToggleGroupItem } from './ui/toggle-group';
import { userPreferencesSchema } from '@/schemas';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField } from './ui/form';
import { type NoteFormat } from '@prisma/client';

type UserPreferences = z.infer<typeof userPreferencesSchema>;

export default function SettingsDialog() {
  const userPreferences = useForm<UserPreferences>({
    resolver: zodResolver(userPreferencesSchema),
  });

  function handleSaveUserPreferences(values: UserPreferences) {
    console.log(values);
  }

  const fieldClassname =
    'w-full h-24 bg-white/10 outline outline-2 data-[active=true]:outline-white data-[active=false]:outline-transparent';

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type='button' variant='dropdown' size='xs'>
          Settings
          <Bolt size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className='dark bg-black w-[624px] max-w-screen'>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <Tabs>
          <TabsList defaultValue='appearance' className='w-full'>
            <TabsTrigger className='w-full' value='appearance'>
              Appearance
            </TabsTrigger>
          </TabsList>
          <TabsContent value='appearance'>
            <h3 className='text-lg my-6 font-medium'>Appearance</h3>
            <section className='grid grid-cols-5'>
              <div className='col-span-2'>
                <h4 className='text-base'>Note style</h4>
                <p className='text-silver text-sm'>
                  How are notes displayed in sidebar
                </p>
              </div>
              <Form {...userPreferences}>
                <form
                  onSubmit={userPreferences.handleSubmit(
                    handleSaveUserPreferences,
                  )}
                  className='col-span-3 flex flex-col gap-3'
                  id='user-preferences-form'
                >
                  <FormField
                    control={userPreferences.control}
                    name='note-format'
                    defaultValue='full'
                    render={({ field }) => (
                      <ToggleGroup
                        type='single'
                        className='gap-3'
                        value={field.value}
                        onValueChange={(value: NoteFormat) => {
                          userPreferences.setValue('note-format', value);
                        }}
                        {...userPreferences.register('note-format')}
                      >
                        <ToggleGroupItem
                          value='full'
                          data-active={field.value === 'full'}
                          className={fieldClassname}
                        >
                          <FullNote />
                        </ToggleGroupItem>
                        <ToggleGroupItem
                          value='slim'
                          data-active={field.value === 'slim'}
                          className={fieldClassname}
                        >
                          <SlimNote />
                        </ToggleGroupItem>
                      </ToggleGroup>
                    )}
                  />
                  <div className='grid grid-cols-2'>
                    <p className='font-medium'>Full</p>
                    <p className='font-medium'>Slim</p>
                  </div>
                  <footer>
                    <Button
                      variant='default'
                      form='user-preferences-form'
                      type='submit'
                      size='sm'
                      className='float-end'
                    >
                      Save changes
                    </Button>
                  </footer>
                </form>
              </Form>
            </section>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

function FullNote() {
  return (
    <div className='h-fit rounded-sm shrink-0 bg-wisteria min-w-full flex flex-col gap-2 p-3'>
      <div className='bg-black/40 rounded-sm min-w-[80%] h-6'></div>
      <div className='grid grid-cols-3 gap-2'>
        <div className='bg-black/20 rounded-sm min-w-[80%] h-4'></div>
        <div className='bg-black/25 rounded-sm min-w-[80%] h-4 col-span-2'></div>
      </div>
    </div>
  );
}

function SlimNote() {
  return (
    <div className='h-fit rounded-sm shrink-0 bg-wisteria min-w-full flex flex-col gap-2 p-3'>
      <div className='bg-black/40 rounded-sm min-w-[80%] h-6'></div>
    </div>
  );
}
