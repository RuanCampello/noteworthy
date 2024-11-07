import { Loading } from '@/components/Loading';
import { type ReactNode, Suspense } from 'react';

export default function NoteLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <main className='flex flex-col h-full overflow-y-clip overflow-x-hidden flex-1 w-fit'>
      <Suspense fallback={<Loading />}>{children}</Suspense>
    </main>
  );
}
