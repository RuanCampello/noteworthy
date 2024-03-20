import SubSidebar from '@/components/SubSidebar';
import NoNotes from '@/components/NoNotes';
import Placeholder from '@/components/Placeholder';
import Resizable from '@/components/Resizable';
import { db } from '@/firebase';
import { NoteType } from '@/types/note-type';
import { getDoc, doc } from 'firebase/firestore';
import { Sparkles, StarOff } from 'lucide-react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function FavouritesPage() {
  const user_id = cookies().get('user_id')?.value;
  if (!user_id) return redirect('/login');

  const response = await getDoc(doc(db, 'userFavourites', user_id));
  if (!response.exists()) return null;

  const favouriteNotes = response.data()['notes'] as NoteType[];
  return (
    <Resizable>
      <div className='flex h-full'>
        <SubSidebar title='Favourites' notes={favouriteNotes}>
          <NoNotes
            headerIcon={<StarOff size={80} strokeWidth={1} />}
            text="You don't have any favourite note"
            paragraph='Choose a note to favourite and make it sparkle!'
            paragraphIcon={<Sparkles size={16} fill='#A3A3A3' />}
          />
        </SubSidebar>
        {favouriteNotes && favouriteNotes.length > 0  && (
          <Placeholder
            paragraph='Choose a favourite note from the list on the left to view its contents, or favourite a note to add to your collection.'
            text='Select a favourite note to view'
          >
            <Sparkles size={80} strokeWidth={1} />
          </Placeholder>
        )}
      </div>
    </Resizable>
  );
}
