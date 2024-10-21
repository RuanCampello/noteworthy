import Note from '@/components/Note/Note';
import { PartialNote } from '@/types/Note';
import { ReactNode } from 'react';

interface SubSidebarProps {
  notes: PartialNote[];
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
    <aside className='w-64 shrink-0 h-full flex flex-col border-r border-midnight relative'>
      <h1 className='font-semibold text-2xl py-10 sticky top-0 z-20 bg-black px-3'>
        {title}
      </h1>
      <div className='w-full h-full flex flex-col gap-1.5 overflow-y-scroll scrollbar-thin scrollbar-thumb-silver scrollbar-track-black px-3'>
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
    </aside>
  );
}
