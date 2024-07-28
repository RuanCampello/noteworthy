'use client';

import { searchNotes } from '@/server/queries/search';
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandItem,
  CommandGroup,
} from '@/ui/command';
import { useQuery } from '@tanstack/react-query';
import { useState, useTransition } from 'react';
import useKeyboardShortcut from 'use-keyboard-shortcut';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { FilePlus2, NotebookText } from 'lucide-react';
import { NoteItemWrapper } from './Item';
import { stripHTMLTags } from '@/utils/format';
import { createFastNote } from '@/server/actions/note';

export default function Search() {
  const [open, setOpen] = useState<boolean>(false);
  const [query, setQuery] = useState<string>('');
  const router = useRouter();
  const [loading, startTransition] = useTransition();
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

  const { data: results } = useQuery({
    queryKey: ['search', query],
    queryFn: async () => {
      const results = await searchNotes(query);
      return results;
    },
    enabled: !!query,
  });

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        onValueChange={(v) => setQuery(v)}
        placeholder={t('placeholder')}
      />
      <CommandList>
        {/* <CommandEmpty>No results found.</CommandEmpty> */}
        {results && (
          <CommandGroup heading={t('search_res')}>
            {results.map((r) => {
              const content = stripHTMLTags(r.content);
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
                    content={content}
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
            <div className='p-1 bg-night group-aria-selected:bg-slate rounded-sm'>
              <FilePlus2 size={12} strokeWidth={1.75} />
            </div>
            <span>{t('new_note')}</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
