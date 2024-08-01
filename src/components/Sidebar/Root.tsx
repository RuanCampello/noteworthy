'use client';

import { useSidebarState } from '@/lib/zustand/sidebar';
import { ReactNode } from 'react';

export default function Root({ children }: { children: ReactNode }) {
  const { state } = useSidebarState();

  return (
    <aside
      data-state={state}
      className='2xl:w-[18vw] w-[20vw] shrink-0 grow-0 flex flex-col pt-7 gap-7 h-screen border-r border-r-midnight data-[state=closed]:w-[4vw] overflow-x-hidden data-[state=closed]:items-center group/root transition-all duration-300'
    >
      {children}
    </aside>
  );
}
