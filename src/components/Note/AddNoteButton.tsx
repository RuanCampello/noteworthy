import AddNoteDialog from './AddNoteDialog';
import { Plus } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export default async function AddNoteButton() {
  const t = await getTranslations('Sidebar');

  return (
    <div className='px-5 group-data-[state=closed]/root:px-0 group-data-[state=closed]/root:self-center group/root'>
      <AddNoteDialog>
        <button
          type='button'
          className='w-full group-data-[state=closed]/root:h-10 group-data-[state=closed]/root:w-10 bg-midnight hover:bg-white/10 transition-colors duration-200 py-2.5 rounded-sm flex justify-center items-center gap-2 font-semibold group/button focus:outline focus:outline-white focus:outline-offset-2 focus:outline-2'
        >
          <Plus
            size={20}
            className='text-white group-active/button:scale-105 group-active/button:rotate-90 group-focus/button:rotate-90 group-focus/button:scale-105 group-hover/button:rotate-90 group-hover/button:scale-105 transition-transform duration-200'
          />
          <span className='md:inline hidden group-data-[state=closed]/root:hidden'>
            {t('new_note')}
          </span>
        </button>
      </AddNoteDialog>
    </div>
  );
}
