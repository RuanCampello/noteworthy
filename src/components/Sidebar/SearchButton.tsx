'use client';

import { Search } from 'lucide-react';

export default function SearchButton() {
  return (
    <button className='w-12 h-full flex group-data-[state=closed]/root:hidden items-center justify-center rounded-sm bg-midnight hover:bg-white/10 transition-colors'>
      <Search size={20} />
    </button>
  );
}
