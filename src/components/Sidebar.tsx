import Logo from './Logo';
import { Plus } from 'lucide-react';
import Notes from './Notes';
import More from './More';

export default function Sidebar() {
  return (
    <div className='w-full flex flex-col py-7 gap-7'>
      <Logo />
      <div className='justify-center flex flex-col gap-7'>
        <div className='px-5'>
          <button className='w-full bg-midnight hover:bg-white/10 transition-colors duration-200 py-2.5 rounded-sm flex justify-center items-center gap-2 font-semibold'>
            <Plus size={20} className='text-white' />
            New Note
          </button>
        </div>
        <Notes />
        <More />
      </div>
    </div>
  );
}
