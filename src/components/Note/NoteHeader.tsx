import { currentUser } from '@/queries/note';
import type { Note } from '@/types/Note';
import { toLocaleDateLong } from '@/utils/date';
import {
  CalendarClock,
  CalendarDays,
  Pencil,
  SquareUserRound,
  View,
} from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { headers } from 'next/headers';
import StatusTooltip from '../StatusTooltip';
import { Separator } from '../ui/separator';
import WordCounter from '../WordCounter';
import Dropdown from './NoteDropdown';
import NoteHeaderItem from './NoteHeaderItem';
import PublishNoteDialog from './PublishNoteDialog';
import SaveNote from './SaveNote';

interface NoteHeaderProps {
  note: Note;
}

export default async function NoteHeader({ note }: NoteHeaderProps) {
  const { lastUpdate, name: username, title, createdAt } = note;
  const longLastUpdate = toLocaleDateLong(lastUpdate);
  const longDate = toLocaleDateLong(createdAt);
  const user = await currentUser();
  const t = await getTranslations('Header');
  const th = await getTranslations('NoteHeader');

  const params = headers().get('search-params');
  const isDictionaryOpen = new URLSearchParams(params!).has('dfn-open');

  if (!user) return;
  const isEditor = user.id === note.userId;

  return (
    <header className='sticky xl:px-0 px-6 xl:pt-16 pt-8'>
      <div className='flex justify-between items-center xl:mb-8 mb-8'>
        <h1
          className='text-3xl font-semibold line-clamp-1 w-[90%] font-garamound'
          title={title}
        >
          {title}
        </h1>
        {isEditor && (
          <div className='flex gap-2 items-center'>
            <SaveNote />
            <Dropdown note={note}>
              <PublishNoteDialog />
            </Dropdown>
          </div>
        )}
      </div>
      <Separator className='mb-1.5' />
      <div className='flex justify-between w-full items-center'>
        <div
          data-dictionary={isDictionaryOpen}
          className='font-medium grow text-silver data-[dictionary=true]:justify-items-center xl:grid xl:grid-cols-4 xl:gap-0 px-2 flex flex-col gap-1'
        >
          <NoteHeaderItem name={t('created')} value={longDate}>
            <CalendarDays size={20} strokeWidth={2} />
          </NoteHeaderItem>
          <NoteHeaderItem
            name={t('modified')}
            value={lastUpdate ? longLastUpdate : longDate}
          >
            <CalendarClock size={20} strokeWidth={2} />
          </NoteHeaderItem>
          <NoteHeaderItem name={t('owner')} value={username}>
            <SquareUserRound size={20} strokeWidth={2} />
          </NoteHeaderItem>
          <WordCounter />
        </div>
        {isEditor ? (
          <StatusTooltip
            icon={<Pencil />}
            className='bg-slate h-fit'
            content={th('editor')}
          />
        ) : (
          <StatusTooltip
            icon={<View />}
            className='bg-tickle h-fit'
            content={th('viewer')}
          />
        )}
      </div>
      <Separator className='my-1.5' />
    </header>
  );
}
