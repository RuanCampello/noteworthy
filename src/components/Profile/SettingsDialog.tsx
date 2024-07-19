'use client';

import { Bolt } from 'lucide-react';
import { Button } from '@/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTitle, TabsTrigger } from '@/ui/tabs';
import { ToggleGroup, ToggleGroupItem } from '@/ui/toggle-group';
import { userPreferencesSchema } from '@/schemas';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField } from '@/ui/form';
import {
  type NoteFormat,
  type UserPreferences as Preferences,
} from '@prisma/client';
import { useState, useTransition, type ReactNode } from 'react';
import { updateUserPreferences } from '@/server/actions/user-preferences';
import { useRouter } from 'next/navigation';
import EditProfile from './EditProfile';

type UserPreferences = z.infer<typeof userPreferencesSchema>;

interface SettingsProps {
  preferences: Preferences | null;
}

export default function SettingsDialog({ preferences }: SettingsProps) {
  const [loading, startTransition] = useTransition();
  const [open, setOpen] = useState<boolean>(false);
  const router = useRouter();
  const userPreferences = useForm<UserPreferences>({
    resolver: zodResolver(userPreferencesSchema),
  });

  function handleSaveUserPreferences(values: UserPreferences) {
    startTransition(async () => {
      await updateUserPreferences(values);
      router.refresh();
      setOpen(false);
    });
  }

  const fieldClassname =
    'h-20 w-full bg-white/10 outline outline-2 outline-offset-2 data-[active=true]:outline-white data-[active=false]:outline-transparent';
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type='button' variant='dropdown' size='xs'>
          Settings
          <Bolt size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className='dark bg-black w-[524px] max-w-screen'>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <Tabs>
          <TabsList defaultValue='appearance' className='w-full'>
            <TabsTrigger className='w-full' value='appearance'>
              Appearance
            </TabsTrigger>
            <TabsTrigger className='w-full' value='profile'>
              Profile
            </TabsTrigger>
          </TabsList>
          <TabsContent value='appearance'>
            <TabsTitle>Appearance</TabsTitle>
            <section className='grid grid-cols-5'>
              <div className='col-span-2'>
                <h4 className='text-base font-medium'>Note style</h4>
                <p className='text-silver text-sm'>
                  How are notes displayed in sidebar
                </p>
              </div>
              <Form {...userPreferences}>
                <form
                  onSubmit={userPreferences.handleSubmit(
                    handleSaveUserPreferences,
                  )}
                  className='col-span-3 flex flex-col gap-2'
                  id='user-preferences-form'
                >
                  <FormField
                    control={userPreferences.control}
                    name='note-format'
                    defaultValue={preferences?.noteFormat || 'full'}
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
                  <div className='grid grid-cols-2 font-medium text-base'>
                    <p>Default</p>
                    <p>Compact</p>
                  </div>
                  <footer className='mt-4'>
                    <Button
                      variant='default'
                      form='user-preferences-form'
                      type='submit'
                      size='sm'
                      className='float-end'
                      disabled={loading}
                    >
                      Save changes
                    </Button>
                  </footer>
                </form>
              </Form>
            </section>
          </TabsContent>
          <TabsContent value='profile'>
            <TabsTitle>Edit Profile</TabsTitle>
            <section className='flex flex-col items-center'>
              <EditProfile />
            </section>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

function FullNote() {
  return (
    <Note>
      <div className='bg-black/40 rounded-sm min-w-[80%] h-5'></div>
      <div className='grid grid-cols-3 gap-2'>
        <div className='bg-black/20 rounded-sm min-w-[80%] h-3'></div>
        <div className='bg-black/25 rounded-sm min-w-[80%] h-3 col-span-2'></div>
      </div>
    </Note>
  );
}

function SlimNote() {
  return (
    <Note>
      <div className='bg-black/40 rounded-sm min-w-[80%] h-5'></div>
    </Note>
  );
}

function Note({ children }: { children: ReactNode }) {
  return (
    <div className='h-fit rounded-sm shrink-0 bg-wisteria min-w-full flex flex-col gap-2 p-2'>
      {children}
    </div>
  );
}
