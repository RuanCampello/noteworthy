'use client';

import { useSettingsStore } from '@/lib/zustand/settings';
import { useSettingsDialogStore } from '@/lib/zustand/settings-dialog';
import { userPreferencesSchema } from '@/schemas';
import { updateUserPreferences } from '@/server/actions/user-preferences';
import { Button } from '@/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/ui/dialog';
import { Form, FormField } from '@/ui/form';
import { Separator } from '@/ui/separator';
import { Switch } from '@/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTitle, TabsTrigger } from '@/ui/tabs';
import { ToggleGroup, ToggleGroupItem } from '@/ui/toggle-group';
import { Locale } from '@/utils/constants/locales';
import { zodResolver } from '@hookform/resolvers/zod';
import { Bolt } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useTransition, type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import type { NoteFormat, Preferences } from '../../types/database-types';
import EditProfile from './EditProfile';
import LanguageSwitcher from './LanguageSwitcher';

type UserPreferences = z.infer<typeof userPreferencesSchema>;

interface SettingsProps {
  preferences: Preferences | null;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function SettingsDialog({ preferences }: SettingsProps) {
  const [loading, startTransition] = useTransition();
  const { isOpen, setOpen } = useSettingsDialogStore();
  const { setOpen: setSettingsOpen } = useSettingsStore();
  const t = useTranslations('Settings');
  const locale = useLocale();

  const userPreferences = useForm<UserPreferences>({
    resolver: zodResolver(userPreferencesSchema),
    defaultValues: {
      fullNote:
        preferences?.fullNote !== undefined ? preferences.fullNote : true,
      language: locale as Locale,
      noteFormat: preferences?.noteFormat || 'full',
    },
  });

  function handleSaveUserPreferences(values: UserPreferences) {
    startTransition(async () => {
      await updateUserPreferences(values);
      setOpen(false);
      setSettingsOpen(false);
    });
  } // TODO: correct note full width revalidation after change

  const fieldClassname =
    'h-20 w-full bg-white/10 outline outline-2 outline-offset-2 data-[active=true]:outline-white data-[active=false]:outline-transparent';
  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type='button' variant='dropdown' size='xs'>
          {t('title')}
          <Bolt size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className='dark bg-black w-[524px] max-w-screen'>
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
        </DialogHeader>
        <Tabs>
          <TabsList defaultValue='appearance' className='w-full'>
            <TabsTrigger className='w-full' value='appearance'>
              {t('appearance')}
            </TabsTrigger>
            <TabsTrigger className='w-full' value='profile'>
              {t('profile')}
            </TabsTrigger>
          </TabsList>
          <TabsContent value='appearance'>
            <TabsTitle>{t('appearance')}</TabsTitle>
            <Form {...userPreferences}>
              <form
                onSubmit={userPreferences.handleSubmit(
                  handleSaveUserPreferences,
                )}
                className='flex flex-col gap-6 justify-center'
                id='user-preferences-form'
              >
                <SettingsItem>
                  <div className='col-span-2'>
                    <h4 className='text-base font-medium'>{t('note_style')}</h4>
                    <p className='text-silver text-sm'>{t('note_style_dsc')}</p>
                  </div>
                  <FormField
                    control={userPreferences.control}
                    name='noteFormat'
                    defaultValue={preferences?.noteFormat || 'full'}
                    render={({ field }) => (
                      <ToggleGroup
                        type='single'
                        className='gap-3 col-span-3'
                        value={field.value}
                        onValueChange={(value: NoteFormat) => {
                          userPreferences.setValue('noteFormat', value);
                        }}
                        {...userPreferences.register('noteFormat')}
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
                </SettingsItem>
                <Separator />
                <SettingsItem>
                  <div className='col-span-2'>
                    <h4 className='text-base font-medium'>{t('full_note')}</h4>
                    <p className='text-silver text-sm'>{t('full_note_dsc')}</p>
                  </div>
                  <FormField
                    control={userPreferences.control}
                    name='fullNote'
                    render={({ field }) => (
                      <Switch
                        type='button'
                        checked={field.value}
                        defaultChecked
                        onCheckedChange={field.onChange}
                        className='dark'
                        id='full-note-switch'
                      />
                    )}
                  />
                </SettingsItem>
                <Separator />
                <SettingsItem>
                  <div className='col-span-2'>
                    <h4 className='text-base font-medium'>{t('lang')}</h4>
                  </div>
                  <FormField
                    control={userPreferences.control}
                    name='language'
                    render={({ field }) => (
                      <LanguageSwitcher onChange={field.onChange} />
                    )}
                  />
                </SettingsItem>
              </form>
              <Button
                variant='default'
                form='user-preferences-form'
                type='submit'
                size='sm'
                className='float-end mt-4'
                disabled={loading}
              >
                {t('button')}
              </Button>
            </Form>
          </TabsContent>
          <TabsContent value='profile'>
            <TabsTitle>{t('edit_profile')}</TabsTitle>
            <section className='flex flex-col items-center'>
              <EditProfile />
            </section>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

function SettingsItem({ children }: { children: ReactNode }) {
  return (
    <section className='grid grid-cols-5 gap-4 items-start'>{children}</section>
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
