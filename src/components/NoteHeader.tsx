import {
  CalendarClock,
  CalendarDays,
  MoreHorizontal,
  SquareUserRound,
} from 'lucide-react';
import Dropdown from './Dropdown';
import { Separator } from './ui/separator';
import { secondsToLocaleDateLong } from '@/utils/date';
import SaveNote from './SaveNote';
import WordCounter from './WordCounter';
import NoteHeaderItem from './NoteHeaderItem';

interface NoteHeaderProps {
  title: string;
  date: number;
  owner: string;
  id: string;
  lastUpdate: number;
}
export default async function NoteHeader({
  title,
  date,
  owner,
  id,
  lastUpdate,
}: NoteHeaderProps) {
  const longLastUpdate = secondsToLocaleDateLong(lastUpdate);
  const longDate = secondsToLocaleDateLong(date);
  return (
    <div className='sticky xl:px-11 px-6 xl:pt-14 pt-8'>
      <div className='flex justify-between items-center xl:mb-14 mb-8'>
        <h1
          className='text-4xl font-semibold line-clamp-1 w-[90%]'
          title={title}
        >
          {title}
        </h1>
        <SaveNote />
        <Dropdown noteId={id}>
          <button className='h-fit focus:rounded-full focus:outline-offset-2'>
            <MoreHorizontal
              size={38}
              className='text-white/60 border-2 border-white/60 hover:text-neutral-200 hover:border-neutral-100 transition-colors duration-200 rounded-full focus:outline-none p-2'
            />
          </button>
        </Dropdown>
      </div>
      <Separator className='mb-3' />
      <div className='font-medium text-silver xl:grid xl:grid-cols-4 xl:gap-0 px-2 flex flex-col gap-1'>
        <NoteHeaderItem name='Created' value={longDate}>
          <CalendarDays size={22} strokeWidth={2} />
        </NoteHeaderItem>
        <NoteHeaderItem
          name='Modified'
          value={lastUpdate ? longLastUpdate : longDate}
        >
          <CalendarClock size={22} strokeWidth={2} />
        </NoteHeaderItem>
        <NoteHeaderItem name='Owner' value={owner}>
          <SquareUserRound size={22} strokeWidth={2} />
        </NoteHeaderItem>
        <WordCounter />
      </div>
    </div>
  );
}
