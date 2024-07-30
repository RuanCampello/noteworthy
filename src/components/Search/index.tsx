'use client';

import { searchNotes } from '@/server/queries/search';
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandItem,
  CommandGroup,
  CommandEmpty,
  CommandIcon,
} from '@/ui/command';
import { useQuery } from '@tanstack/react-query';
import { useState, useTransition } from 'react';
import useKeyboardShortcut from 'use-keyboard-shortcut';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { NoteItemWrapper } from './Item';
import { createFastNote } from '@/server/actions/note';
import {
  ArrowDown,
  ArrowUp,
  FilePlus2,
  NotebookText,
  NotepadTextDashed,
  Settings,
  Undo2,
} from 'lucide-react';
import NotFound from '@/assets/svg/oooscillate.svg';
import Image from 'next/image';
import { CommandFooter } from './Footer';
import { useSettingsDialogStore } from '@/lib/zustand/settings-dialog';
import { useSettingsStore } from '@/lib/zustand/settings';

export default function Search() {
  const [open, setOpen] = useState<boolean>(false);
  const [query, setQuery] = useState<string>('');
  const [loading, startTransition] = useTransition();
  const { setOpen: setSettingsDialogOpen } = useSettingsDialogStore();
  const { setOpen: setSettingsOpen } = useSettingsStore();
  const router = useRouter();
  const t = useTranslations('Search');

  useKeyboardShortcut(['Control', 'K'], () => setOpen(true), {
    overrideSystem: true,
    repeatOnHold: false,
    ignoreInputFields: true,
  });

  // ignore ctrl + j to prevent miss click and bug the browser
  useKeyboardShortcut(['Control', 'J'], () => {}, {
    overrideSystem: true,
    repeatOnHold: false,
    ignoreInputFields: true,
  });

  const { data: results, isLoading } = useQuery({
    queryKey: ['search', query],
    queryFn: async () => {
      const results = await searchNotes(query);
      return results;
    },
    enabled: !!query && query.length > 2,
  });

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        loading={isLoading}
        onValueChange={(v) => setQuery(v)}
        placeholder={t('placeholder')}
      />
      <CommandList>
        {isLoading && <LoadingFallback />}
        {!isLoading && (
          <CommandEmpty>
            <NotFoundFallback query={query} />
          </CommandEmpty>
        )}
        {results && Array.isArray(results) && (
          <CommandGroup heading={t('search_res')}>
            {results.map((r) => {
              const hightlight = r.highlighted_content;
              const uniqueValue = r.id + r.title + r.content;

              return (
                <CommandItem
                  className='group'
                  key={r.id}
                  value={uniqueValue}
                  onSelect={() => {
                    router.push(`/notes/${r.id}`);
                    setOpen(false);
                  }}
                >
                  <NoteItemWrapper
                    id={r.id}
                    content={hightlight || r.content}
                    title={r.title}
                    icon={<NotebookText />}
                  />
                </CommandItem>
              );
            })}
          </CommandGroup>
        )}
        <CommandGroup heading={t('quick_act')}>
          <CommandItem
            disabled={loading}
            onSelect={() => {
              startTransition(async () => {
                const note = await createFastNote();
                router.push(`/notes/${note?.id}`);
                setOpen(false);
              });
            }}
          >
            <CommandIcon icon={FilePlus2} />
            <span>{t('new_note')}</span>
          </CommandItem>
          <CommandItem
            disabled={loading}
            onSelect={() => {
              setSettingsOpen(true);
              setSettingsDialogOpen(true);
              setOpen(false);
            }}
          >
            <CommandIcon icon={Settings} />
            <span>Open settings</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
      <CommandFooter.Root>
        <CommandFooter.Group>
          <CommandFooter.Icon icon={ArrowUp} />
          <CommandFooter.Icon icon={ArrowDown} />
          <p>navigate</p>
        </CommandFooter.Group>
        <CommandFooter.Group>
          <CommandFooter.Icon icon={Undo2} className='-scale-y-100' />
          <p>open</p>
        </CommandFooter.Group>
        <CommandFooter.Group>
          <CommandFooter.Icon text='esc' />
          <p>close</p>
        </CommandFooter.Group>
      </CommandFooter.Root>
    </CommandDialog>
  );
}

function LoadingFallback() {
  return (
    <div className='bg-transparent h-12 px-2 rounded-sm flex items-center gap-2'>
      <div className='w-7 h-7 bg-midnight animate-pulse rounded-sm shrink-0' />
      <div className='flex gap-2 w-full items-center'>
        <div className='flex flex-col h-fit w-full gap-1'>
          <div className='w-full bg-midnight h-4 rounded-sm animate-pulse' />
          <div className='w-full bg-midnight h-2 rounded-sm animate-pulse' />
        </div>
        <div className='w-5 shrink-0 h-5 bg-midnight rounded-sm animate-pulse' />
      </div>
    </div>
  );
}

function NotFoundFallback({ query }: { query: string }) {
  const t = useTranslations('Search');
  return (
    <div className='w-full flex justify-center'>
      <div className='items-center flex flex-col'>
        <NotepadTextDashed className='w-7 h-7' />
        <h2 className='font-semibold text-base my-1.5'> {t('not_found_t')} </h2>
        <div className='text-neutral-300'>
          <p> {`"${query}" ${t('not_found')}`} </p>
          <p>{t('try_again')}</p>
        </div>
      </div>
      <Image
        src={NotFound}
        className='absolute -z-10 -translate-y-14 brightness-50'
        alt={t('not_found_t')}
      />
    </div>
  );
}
