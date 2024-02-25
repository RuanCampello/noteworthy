import FavouriteSidebar from '@/components/FavouriteSidebar';
import Placeholder from '@/components/Placeholder';
import Resizable from '@/components/Resizable';
import { db } from '@/firebase';
import { NoteType } from '@/types/note-type';
import { getDoc, doc } from 'firebase/firestore';
import { Sparkles } from 'lucide-react';
import { cookies } from 'next/headers';

export default async function FavouritesPage() {
  const user_id = cookies().get('user_id')?.value;

  if (!user_id) return null;
  const response = await getDoc(doc(db, 'userFavourites', user_id));
  if (!response.exists()) return null;

  const favouriteNotes = response.data()['notes'] as NoteType[];
  return (
    <Resizable>
      <div className='flex h-full'>
        <FavouriteSidebar favouriteNotes={favouriteNotes} />
        {favouriteNotes.length > 0 && (
          <Placeholder text='Select a favourite note to view'>
            <Sparkles size={80} strokeWidth={1} />
          </Placeholder>
        )}
      </div>
    </Resizable>
  );
}
