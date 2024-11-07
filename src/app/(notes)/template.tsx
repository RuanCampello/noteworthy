import MobileBreadcrumb from '@/components/MobileBreadcrumb';
import Sidebar from '@/components/Sidebar';
import type { ReactNode } from 'react';

export default function NotesRootTemplate({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className='flex w-screen overflow-x-hidden'>
      <MobileBreadcrumb />
      <Sidebar />
      {children}
    </div>
  );
}
