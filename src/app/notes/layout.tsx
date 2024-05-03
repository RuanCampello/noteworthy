import { Loading } from '@/components/Loading';
import Sidebar from '@/components/Sidebar';
import { Suspense } from 'react';

export default function NoteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='flex h-screen w-full'>
      <Sidebar />
      <div className='flex flex-col h-full overflow-y-clip grow'>
        <Suspense fallback={<Loading />}>{children}</Suspense>
      </div>
    </div>
  );
}
