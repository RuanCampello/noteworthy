'use client';

import { searchNotes } from '@/actions';
import { useSearch } from '@/lib/zustand/search';
import { useFilter } from '@/lib/zustand/search-filter';
import { Command } from '@/ui/command';
import { Dialog } from '@/ui/dialog';
import { ArrowDown, ArrowUp, Undo2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useTransition } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { CommandFooter } from './Footer';

export default function Search() {
  const [loading, startTransition] = useTransition();
  const filter = useFilter((s) => s.filter);

  const open = useSearch((s) => s.open);
  const setOpen = useSearch((s) => s.setOpen);
  const query = useSearch((s) => s.query);
  const setSearchResults = useSearch((s) => s.setSearchResults);
  const setLoading = useSearch((s) => s.setLoading);
  const setQuery = useSearch((s) => s.setQuery);

  const tf = useTranslations('SearchFooter');

  useHotkeys('ctrl+k', () => setOpen(!open), {
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
