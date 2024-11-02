import Sidebar from '@/components/Sidebar';
import { type ReactNode } from 'react';

export default function NotesLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className='flex w-screen overflow-x-hidden'>
      <Sidebar />
      {children}
    </div>
  );
}
