import { NoteType } from '@/types/note-type';
import Note from './Note';
import { ReactNode } from 'react';

interface SubSidebarProps {
  notes: NoteType[];
  children?: ReactNode;
  title: string;
}

export default function SubSidebar({
  notes,
  children,
  title,
}: SubSidebarProps) {
  if (!notes) return children;
  if (notes.length <= 0) {
    return children;
  }
  return (
    <div className='w-64 shrink-0 h-full overflow-y-scroll scrollbar-thin scrollbar-thumb-silver scrollbar-track-black flex flex-col px-3 gap-2 border-r border-neutral-950'>
      <h1 className='font-semibold text-2xl my-10'>{title}</h1>
      {notes.map((note) => (
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
