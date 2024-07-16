import {
  CalendarClock,
  CalendarDays,
  Pencil,
  SquareUserRound,
  View,
} from 'lucide-react';
import Dropdown from './NoteDropdown';
import { Separator } from '../ui/separator';
import SaveNote from './SaveNote';
import WordCounter from '../WordCounter';
import NoteHeaderItem from './NoteHeaderItem';
import { toLocaleDateLong } from '@/utils/date';
import { currentUser } from '@/queries/note';
import StatusTooltip from '../StatusTooltip';
import { headers } from 'next/headers';
import PublishNoteDialog from './PublishNoteDialog';

export type Owner = {
  name: string | null;
  id: string;
};

interface NoteHeaderProps {
  title: string;
  date: Date;
  owner: Owner;
  id: string;
  lastUpdate: Date;
}
export default async function NoteHeader({
  title,
  date,
  owner,
  id,
  lastUpdate,
}: NoteHeaderProps) {
  const longLastUpdate = toLocaleDateLong(lastUpdate);
  const longDate = toLocaleDateLong(date);
  const user = await currentUser();

  const params = headers().get('search-params');
  const isDictionaryOpen = new URLSearchParams(params!).has('dfn-open');

  if (!user) return;
  const isEditor = user.id === owner.id;

  return (
    <header className='sticky xl:px-12 px-6 xl:pt-8 pt-8'>
      <div className='flex justify-between items-center xl:mb-8 mb-8'>
        <h1
          className='text-3xl font-semibold line-clamp-1 w-[90%]'
          title={title}
        >
          {title}
        </h1>
        {isEditor && (
          <div className='flex gap-2 items-center'>
            <SaveNote />
            <Dropdown>
              <PublishNoteDialog />
            </Dropdown>
          </div>
        )}
      </div>
      <Separator className='mb-1.5' />
      <div className='flex justify-between w-full'>
        <div
          data-dictionary={isDictionaryOpen}
          className='font-medium grow text-silver data-[dictionary=true]:justify-items-center xl:grid xl:grid-cols-4 xl:gap-0 px-2 flex flex-col gap-1'
        >
          <NoteHeaderItem name='Created' value={longDate}>
            <CalendarDays size={20} strokeWidth={2} />
          </NoteHeaderItem>
          <NoteHeaderItem
            name='Modified'
            value={lastUpdate ? longLastUpdate : longDate}
          >
            <CalendarClock size={20} strokeWidth={2} />
          </NoteHeaderItem>
          <NoteHeaderItem name='Owner' value={owner.name!}>
            <SquareUserRound size={20} strokeWidth={2} />
          </NoteHeaderItem>
          <WordCounter />
        </div>
        {isEditor ? (
          <StatusTooltip
            icon={<Pencil />}
            className='bg-slate'
            content={"You're an editor able to edit the document directly"}
          />
        ) : (
          <StatusTooltip
            icon={<View />}
            className='bg-tickle'
            content={"You're a view able to read the document"}
          />
        )}
      </div>
      <Separator className='my-1.5' />
    </header>
  );
}
