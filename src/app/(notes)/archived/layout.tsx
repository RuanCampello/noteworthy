import NoNotes from '@/components/Note/NoNotes';
import Sidebar from '@/components/Sidebar';
import SubSidebar from '@/components/SubSidebar';
import { currentUser } from '@/queries/note';
import { API } from '@/server/api';
import { ArchiveX, ArchiveRestore } from 'lucide-react';
import { type ReactNode } from 'react';

export default async function FavouriteLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const user = await currentUser();
  if (!user?.id) return;
  const api = new API(user.id);
  const archivedNotes = await api.notes.archived.get();
  return (
    <div className='flex h-screen w-full'>
      <Sidebar />
      <SubSidebar
        notes={archivedNotes!}
        title={'Archived notes '}
        href='archived'
      >
        <NoNotes
          headerIcon={<ArchiveX size={80} strokeWidth={1} />}
          text="You don't have any archived note"
          paragraph='Select a note to archive and watch it shimmer away into your archives!'
          paragraphIcon={<ArchiveRestore size={16} fill='#A3A3A3' />}
        />
      </SubSidebar>
      {archivedNotes && archivedNotes.length > 0 && children}
    </div>
  );
}
