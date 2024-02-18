import { CalendarDays, MoreHorizontal, SquareUserRound } from 'lucide-react';
import Dropdown from './Dropdown';
import { Separator } from './ui/separator';

interface NoteHeaderProps {
  title: string;
  date: string;
  owner: string;
}

export default function NoteHeader({ title, date, owner }: NoteHeaderProps) {
  return (
    <div>
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
          <span className='text-neutral-100'>{date}</span>
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
