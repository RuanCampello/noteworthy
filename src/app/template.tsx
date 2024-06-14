import Dictionary from '@/components/Dictionary/Dictionary';
import { headers } from 'next/headers';
import { ReactNode } from 'react';

export default async function Template({ children }: { children: ReactNode }) {
  const headersList = headers();
  const params = headersList.get('search-params');

  const searchParams = new URLSearchParams(params!);
  const isDictionaryOpen = !!searchParams.get('dfn-open');
  const word = searchParams.get('dfn-word') || undefined;

  return (
    <main className='flex relative'>
      {children}
      {isDictionaryOpen && <Dictionary word={word} />}
    </main>
  );
}
