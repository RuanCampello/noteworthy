import { currentUser, getNotes } from '@/actions';
import NoNotes from '@/components/Note/NoNotes';
import Sidebar from '@/components/Sidebar';
import SubSidebar from '@/components/SubSidebar';
import { ArchiveRestore, ArchiveX } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { type ReactNode } from 'react';

export default async function FavouriteLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const user = await currentUser();
  if (!user?.id || !user.accessToken) return;

  const archivedNotes = await getNotes();

  const t = await getTranslations('ArchivePlaceholder');
  const st = await getTranslations('SubsidebarTitles');

  return (
    <div className='flex h-screen w-full'>
      <Sidebar />
      <SubSidebar notes={archivedNotes!} title={st('arc')} href='archived'>
        <NoNotes
          headerIcon={<ArchiveX size={80} strokeWidth={1} />}
          text={t('no_arc_title')}
          paragraph={t('no_arc_description')}
          paragraphIcon={<ArchiveRestore size={16} fill='#A3A3A3' />}
        />
      </SubSidebar>
      {archivedNotes && archivedNotes.length > 0 && children}
    </div>
  );
}
