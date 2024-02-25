import { db } from '@/firebase';
import { NoteType } from '@/types/note-type';
import { doc, getDoc } from 'firebase/firestore';
import { cookies } from 'next/headers';
import Note from './Note';
import NoFavourite from './NoFavourite';

interface FavouriteSidebarProps {
  favouriteNotes: NoteType[]
}

export default function FavouriteSidebar({favouriteNotes}:FavouriteSidebarProps) {
  if(favouriteNotes.length <= 0 ) {
    return <NoFavourite/>
  }
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
}
