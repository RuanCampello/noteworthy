import { ReactNode } from 'react';
import { Note as NoteType } from '@prisma/client';
import Note from './Note/Note';

interface SubSidebarProps {
  notes: NoteType[];
  children?: ReactNode;
  title: string;
  href: 'favourites' | 'archived';
}

export default function SubSidebar({
  notes,
  children,
  title,
  href,
}: SubSidebarProps) {
  if (!notes || notes.length <= 0) return children;
  return (
    <div className='w-64 shrink-0 h-full overflow-y-scroll scrollbar-thin scrollbar-thumb-silver scrollbar-track-black flex flex-col px-3 gap-2 border-r border-midnight'>
      <h1 className='font-semibold text-2xl my-10'>{title}</h1>
      {notes.map((note) => (
        <Note
          key={note.id}
          href={href}
          uid={note.id}
          name={note.title}
          date={note.createdAt}
          colour={note.colour}
          text={note.content}
        />
      ))}
    </div>
  );
}
