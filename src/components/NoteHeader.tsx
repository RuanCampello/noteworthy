import { CalendarDays, MoreHorizontal, SquareUserRound } from 'lucide-react';
import Dropdown from './Dropdown';
import { Separator } from './ui/separator';
import { secondsToLocaleDate } from '@/utils/date';

interface NoteHeaderProps {
  title: string;
  date: number;
  owner: string;
}

export default async function NoteHeader({ title, date, owner }: NoteHeaderProps) {
  return (
    <div className='sticky'>
      <div className='flex justify-between mb-8'>
        <h1 className='text-4xl font-semibold'>{title}</h1>
        <Dropdown>
          <button>
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
