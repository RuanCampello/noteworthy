import NotFound from '@/app/not-found';
import FavouriteSidebar from '@/components/FavouriteSidebar';
import NoteEditor from '@/components/NoteEditor';
import NoteHeader from '@/components/NoteHeader';
import Resizable from '@/components/Resizable';
import { db } from '@/firebase';
import { NoteType } from '@/types/note-type';
import { doc, getDoc } from 'firebase/firestore';
import { cookies } from 'next/headers';

export default async function Favourite({
  params,
}: {
  params: { id: string };
}) {
  const user_id = cookies().get('user_id')?.value;
  if (!user_id) return;
  const favouriteNotes = await getDoc(doc(db, 'userFavourites', user_id));
  if (!favouriteNotes.exists()) return;
  const favouriteData = favouriteNotes.data();
  const favouriteNote: NoteType = favouriteData.notes.find(
    (note: NoteType) => note.uid === params.id
  );
  if (!favouriteNote) return <NotFound />;

  const { title, date, owner, uid } = favouriteNote;
  return (
    <Resizable>
      <div className='flex h-full'>
        <FavouriteSidebar />
        <div className='w-full px-8 py-6 overflow-y-clip flex flex-col gap-4'>
          <NoteHeader
            title={title}
            date={date.seconds}
            owner={owner}
            id={uid}
          />
          <NoteEditor />
        </div>
      </div>
    </Resizable>
  );
}
