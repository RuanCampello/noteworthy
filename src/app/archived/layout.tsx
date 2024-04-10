import NoNotes from '@/components/Note/NoNotes';
import Resizable from '@/components/Resizable';
import SubSidebar from '@/components/SubSidebar';
import { currentUser, getAllUserArchivedNotes } from '@/data/note';
import { ArchiveX, ArchiveRestore } from 'lucide-react';

export default async function FavouriteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await currentUser();
  if (!user?.id) return;
  const archivedNotes = await getAllUserArchivedNotes(user.id);
  return (
    <Resizable>
      <div className='flex h-full'>
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
    </Resizable>
  );
}
