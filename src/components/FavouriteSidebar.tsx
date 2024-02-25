import { db } from '@/firebase';
import { NoteType } from '@/types/note-type';
import { doc, getDoc } from 'firebase/firestore';
import { cookies } from 'next/headers';
import Note from './Note';

export default async function FavouriteSidebar() {
  const user_id = cookies().get('user_id')?.value;

  if (!user_id) return null;
  const response = await getDoc(doc(db, 'userFavourites', user_id));
  if (!response.exists()) return null;

  const favouriteNotes = response.data()['notes'] as NoteType[];
  if (favouriteNotes.length > 0) {
    return (
      <div className='w-64 shrink-0 h-full overflow-y-scroll scrollbar-thin scrollbar-thumb-silver scrollbar-track-black flex flex-col px-3 gap-2 border-r border-neutral-950'>
        <h1 className='font-semibold text-2xl my-10'>Favourites</h1>
        {favouriteNotes.map((note) => (
          <Note
            href='favourites'
            key={note.uid}
            uid={note.uid}
            name={note.title}
            date={note.date.seconds}
            colour={note.colour}
            text={note.content}
          />
        ))}
      </div>
    );
  } else {
    return <div>no favourite</div>;
  }
}
