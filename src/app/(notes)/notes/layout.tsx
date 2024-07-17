import { Loading } from '@/components/Loading';
import Sidebar from '@/components/Sidebar';
import { Suspense } from 'react';
import { type ReactNode } from 'react';

export default function NoteLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className='flex w-screen overflow-x-hidden'>
      <Sidebar />
      <div className='flex flex-col h-full overflow-y-clip flex-1 w-fit'>
        <Suspense fallback={<Loading />}>{children}</Suspense>
      </div>
    </div>
  );
}
