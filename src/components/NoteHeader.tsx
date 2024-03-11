import {
  CalendarDays,
  MoreHorizontal,
  SquareUserRound,
} from 'lucide-react';
import Dropdown from './Dropdown';
import { Separator } from './ui/separator';
import { secondsToLocaleDate } from '@/utils/date';
import SaveNote from './SaveNote';
import NoteEditor from './NoteEditor';

interface NoteHeaderProps {
  title: string;
  date: number;
  owner: string;
  id: string;
}
export default async function NoteHeader({
  title,
  date,
  owner,
  id,
}: NoteHeaderProps) {
  return (
    <div className='sticky'>
      <div className='flex justify-between items-center mb-8'>
        <h1
          className='text-4xl font-semibold line-clamp-2 w-[90%]'
          title={title}
        >
          {title}
        </h1>
        <SaveNote />
        <Dropdown noteId={id}>
          <button className='focus:border-white h-fit border-transparent border-2 focus:rounded-full p-1 focus:outline-none'>
            <MoreHorizontal
              size={38}
              className='text-white/60 border-2 border-white/60 hover:text-neutral-200 hover:border-neutral-100 transition-colors duration-200 rounded-full focus:outline-none p-2'
            />
          </button>
        </Dropdown>
      </div>
      <div className='font-semibold text-silver gap-4 flex flex-col'>
        <div className='flex gap-3 items-center'>
          <CalendarDays size={24} strokeWidth={2} />
          <span className='w-24'>Date</span>
          <span className='text-neutral-100'>{secondsToLocaleDate(date)}</span>
        </div>
        <Separator className='bg-white/10' />
        <div className='flex gap-3 items-center'>
          <SquareUserRound size={24} strokeWidth={2} />
          <span className='w-24'>Owner</span>
          <span className='text-neutral-100'>{owner}</span>
        </div>
      </div>
    </div>
  );
}
