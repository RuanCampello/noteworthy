import NoNotes from '@/components/Note/NoNotes';
import Resizable from '@/components/Resizable';
import SubSidebar from '@/components/SubSidebar';
import { currentUser, getAllUserFavouriteNotes } from '@/data/note';
import { StarOff, Sparkles } from 'lucide-react';

export default async function FavouriteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await currentUser();
  if (!user?.id) return;
  const favouriteNotes = await getAllUserFavouriteNotes(user.id);
  return (
    <Resizable>
      <div className='flex h-full'>
        <SubSidebar notes={favouriteNotes!} title={'Favourites'}>
          <NoNotes
            headerIcon={<StarOff size={80} strokeWidth={1} />}
            text="You don't have any favourite note"
            paragraph='Choose a note to favourite and make it sparkle!'
            paragraphIcon={<Sparkles size={16} fill='#A3A3A3' />}
          />
        </SubSidebar>
        {favouriteNotes && favouriteNotes.length > 0 && children}
      </div>
    </Resizable>
  );
}
