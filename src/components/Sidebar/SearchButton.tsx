'use client';

import { Search } from 'lucide-react';
import { useSearch } from '@/lib/zustand/search';

export default function SearchButton() {
  const setOpen = useSearch((s) => s.setOpen);

  return (
    <button
      onClick={() => setOpen(true)}
      className='w-12 h-full group-data-[state=closed]/root:w-10 aspect-square flex items-center justify-center rounded-sm bg-midnight hover:bg-white/10 duration-200 transition-colors'
    >
      <Search size={20} strokeWidth={2} />
    </button>
  );
}
