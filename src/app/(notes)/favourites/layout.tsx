import NoNotes from '@/components/Note/NoNotes';
import Sidebar from '@/components/Sidebar';
import SubSidebar from '@/components/SubSidebar';
import { currentUser, getAllUserFavouriteNotes } from '@/queries/note';
import { StarOff, Sparkles } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { type ReactNode } from 'react';

export default async function FavouriteLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const user = await currentUser();
  if (!user?.id) return;
  const favouriteNotes = await getAllUserFavouriteNotes(user.id);
  const t = await getTranslations('FavouritePlaceholder');
  const st = await getTranslations('SubsidebarTitles');

  return (
    <div className='flex h-screen w-full'>
      <Sidebar />
      <SubSidebar notes={favouriteNotes!} title={st('fav')} href={'favourites'}>
        <NoNotes
          headerIcon={<StarOff size={80} strokeWidth={1} />}
          text={t('no_fav_title')}
          paragraph={t('no_fav_description')}
          paragraphIcon={<Sparkles size={16} fill='#A3A3A3' />}
        />
      </SubSidebar>
      {favouriteNotes && favouriteNotes.length > 0 && children}
    </div>
  );
}
