'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '../ui/input';
import { Search } from 'lucide-react';

export default function DictionarySearch() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const word = searchParams.get('dfn-word');

  async function searchWord(formData: FormData) {
    const word = formData.get('word') as string;
    if (!word) return;

    const params = new URLSearchParams(searchParams);
    params.set('dfn-open', 'true');
    params.set('dfn-word', word);

    router.push(`?${params}`);
    router.refresh();
  }

  return (
    <form
      action={searchWord}
      className='w-full pe-3 flex bg-midnight text-silver rounded-md items-center focus-within:outline-white focus-within:outline focus-within:outline-2'
    >
      <Input
        defaultValue={word || ''}
        className='dark bg-midnight placeholder:text-silver/60 font-medium ring-transparent z-40'
        name='word'
        placeholder='Search for a word'
      />
      <button type='submit' className='h-fit focus:outline-none'>
        <Search size={20} />
      </button>
    </form>
  );
}
