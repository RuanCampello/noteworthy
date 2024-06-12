import { BookA, Search, X } from 'lucide-react';
import { Input } from './ui/input';
import MenuTooltip from './Tooltip';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

interface DictionaryProps {
  word?: string;
}

export default async function Dictionary({ word }: DictionaryProps) {
  async function closeDictionary() {
    'use server';

    const headersList = headers();
    const params = headersList.get('search-params');
    const searchParams = new URLSearchParams(params!);

    if (searchParams.has('dfn-open')) {
      searchParams.delete('dfn-open');
      searchParams.delete('dfn-word');

      redirect(`?${searchParams}`);
    }
  }

  async function searchWord(formData: FormData) {
    'use server';
    
    const word = formData.get('word');
  }

  return (
    <aside className='w-1/4 p-5 border-l border-l-midnight'>
      <header className='flex mb-6 items-center justify-between'>
        <div className='flex items-center gap-1.5'>
          <BookA size={26} />
          <h2 className='text-xl font-medium'>Dictionary</h2>
        </div>
        <MenuTooltip content='Close dictionary'>
          <form action={closeDictionary}>
            <button
              type='submit'
              className='p-1.5 rounded-full text-silver hover:bg-midnight'
            >
              <X size={18} />
            </button>
          </form>
        </MenuTooltip>
      </header>
      <form
        action={searchWord}
        className='w-full pe-3 flex bg-midnight text-silver rounded-md items-center'
      >
        <Input
          defaultValue={word}
          className='dark bg-midnight font-medium ring-transparent'
          name='word'
        />
        <button
          type='submit'
          className='h-fit focus:outline-none'
        >
          <Search size={20} />
        </button>
      </form>
    </aside>
  );
}
