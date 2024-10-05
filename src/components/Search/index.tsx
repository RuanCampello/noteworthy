'use client';

import { useFilter } from '@/lib/zustand/search-filter';
import { useSearch } from '@/lib/zustand/search';
import { searchNotes } from '@/actions';
import { Dialog } from '@/ui/dialog';
import { Command } from '@/ui/command';
import { ArrowDown, ArrowUp, Undo2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useSettingsStore } from '@/lib/zustand/settings';
import { useSettingsDialogStore } from '@/lib/zustand/settings-dialog';
import { useTransition, useEffect } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { generateNote } from '@/actions';
import { CommandFooter } from './Footer';
import { useRouter } from 'next/navigation';

export default function Search() {
  const { open, setOpen } = useSearch();

  const [loading, startTransition] = useTransition();
  const { filter } = useFilter();
  const { query, setSearchResults, setLoading, setQuery } = useSearch();
  const router = useRouter();

  const tf = useTranslations('SearchFooter');

  useHotkeys('ctrl+k', () => setOpen(true), {
    enableOnContentEditable: true,
    preventDefault: true,
    enableOnFormTags: true,
  });

  useEffect(() => {
    setLoading(loading);
  }, [loading, setLoading]);

  useEffect(() => {
    if (query.length > 0) {
      startTransition(async () => {
        const res = await searchNotes(query, filter);
        res && setSearchResults(res);
      });
    }
  }, [query, filter]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Command.Content>
        <Command.Input onChange={(e) => setQuery(e.target.value)} />
        <Command.List />
        <Command.Actions />
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
      </Command.Content>
    </Dialog>
  );
}
