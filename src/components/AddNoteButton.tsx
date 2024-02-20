import { Plus } from 'lucide-react';

export default function AddNoteButton() {
  return (
    <div className='px-5'>
      <button className='w-full bg-midnight hover:bg-white/10 transition-colors duration-200 py-2.5 rounded-sm flex justify-center items-center gap-2 font-semibold group'>
        <Plus size={20} className='text-white group-active:scale-105 group-active:rotate-90 transition-transform duration-200' />
        <span className='md:inline hidden'>New Note</span>
      </button>
    </div>
  );
}
