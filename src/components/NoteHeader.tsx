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
    <div className='sticky px-14 pt-12'>
      <div className='flex justify-between items-center mb-12'>
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
      <div className='font-medium text-silver grid grid-cols-4 px-2'>
        <div className='flex gap-2 items-center'>
          <CalendarDays size={22} strokeWidth={2} />
          <span className='mr-6'>Created</span>
          <span className='text-neutral-100'>{longDate}</span>
        </div>
        <div className='flex gap-2 items-center'>
          <CalendarClock size={22} strokeWidth={2} />
          <span className='mr-6'>Modified</span>
          <span className='text-neutral-100'>
            {lastUpdate ? longLastUpdate : longDate}
          </span>
        </div>
        <div className='flex gap-2 items-center'>
          <SquareUserRound size={22} strokeWidth={2} />
          <span className='mr-6'>Owner</span>
          <span className='text-neutral-100'>{owner}</span>
        </div>
        <WordCounter />
      </div>
    </div>
  );
}
