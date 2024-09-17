'use client';

import NotFound from '@/assets/svg/oooscillate.svg';
import { useFilter } from '@/lib/zustand/search-filter';
import { useSettingsStore } from '@/lib/zustand/settings';
import { useSettingsDialogStore } from '@/lib/zustand/settings-dialog';
import { generateNote, searchNotes } from '@/actions';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandIcon,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/ui/command';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowDown,
  ArrowUp,
  FilePlus2,
  NotebookText,
  NotepadTextDashed,
  Settings,
  Undo2,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useTransition, useDeferredValue } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { CommandFooter } from './Footer';
import { NoteItemWrapper } from './Item';

export default function Search() {
  const [open, setOpen] = useState<boolean>(false);
  const [query, setQuery] = useState<string>('');
  const deferredQuery = useDeferredValue(query);
  const [loading, startTransition] = useTransition();
  const { setOpen: setSettingsDialogOpen } = useSettingsDialogStore();
  const { setOpen: setSettingsOpen } = useSettingsStore();
  const { filter, placeholder, toggleFilter } = useFilter();
  const router = useRouter();

  const t = useTranslations('Search');
  const tf = useTranslations('SearchFooter');

  useHotkeys('ctrl+k', () => setOpen(true), {
    enableOnContentEditable: true,
    preventDefault: true,
    enableOnFormTags: true,
  });

  const { data: results, isLoading } = useQuery({
    queryKey: ['search-command', deferredQuery],
    queryFn: async () => {
      return await searchNotes(deferredQuery, filter);
    },
    enabled: !!deferredQuery && deferredQuery.length > 2,
  });

  const deferredResults = useDeferredValue(results);

  const shouldRender =
    deferredResults && Array.isArray(deferredResults) && !isLoading;

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        loading={isLoading}
        onValueChange={(v) => setQuery(v)}
        placeholder={t(placeholder)}
        onKeyDown={(e) => {
          if (e.key === 'Tab') {
            e.preventDefault();
            toggleFilter();
          }
        }}
      />
      <CommandList>
        {isLoading && <LoadingFallback />}
        {!shouldRender && (
          <CommandEmpty>
            <NotFoundFallback query={deferredQuery} />
          </CommandEmpty>
        )}
        {shouldRender && (
          <CommandGroup heading={t('search_res')}>
            {deferredResults.map((r) => {
              // TODO: solve slow down caused by cmdk
              const highlight = r.highlightedContent;
              const uniqueValue = r.id + r.content;

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
                    content={highlight || r.content}
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
                const id = await generateNote();
                router.push(`/notes/${id}`);
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
            <span>{t('open_settings')}</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
      <CommandFooter.Root>
        <CommandFooter.Group>
          <CommandFooter.Icon icon={ArrowUp} />
          <CommandFooter.Icon icon={ArrowDown} />
          <p>{tf('nav')}</p>
        </CommandFooter.Group>
        <CommandFooter.Group>
          <CommandFooter.Icon icon={Undo2} className='-scale-y-100' />
          <p>{tf('open')}</p>
        </CommandFooter.Group>
        <CommandFooter.Group>
          <CommandFooter.Icon text='esc' />
          <p>{tf('close')}</p>
        </CommandFooter.Group>
        <CommandFooter.Group>
          <CommandFooter.Icon text='tab' />
          <p>{tf('chg-filter')}</p>
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
