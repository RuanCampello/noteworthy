import { currentUser } from '@/actions';
import { env } from '@/env';
import type { Colour } from '@/types/Enums';
import { Colours } from '@/utils/colours';
import { Tag } from '@/utils/constants/filters';
import {
  Archive,
  Globe,
  type LucideIcon,
  type LucideProps,
  NotebookText,
  Star,
} from 'lucide-react';
import Link from 'next/link';
import { createElement } from 'react';

export type Note = {
  id: string;
  title: string;
  content: string;
  colour: Colour;
  userId: string;
  createdAt: string;
  isArchived: boolean;
  isFavourite: boolean;
  isPublic: boolean;
  lastUpdate: string;
  name: string;
};

async function getHubNotes() {
  const user = await currentUser();
  if (!user || !user.accessToken) return;

  const response = await fetch(`${env.INK_HOSTNAME}/notes/hub`, {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${user.accessToken}`,
    },
    cache: 'force-cache',
    next: { tags: [Tag.Hub] },
  });

  const notes: Note[] = await response.json();

  return notes;
}

export default async function HubPage() {
  const notes = await getHubNotes();

  return (
    <main className='px-5 xl:px-10 overflow-x-hidden overflow-y-scroll h-full'>
      <h1 className='font-semibold text-2xl py-8 sticky top-0 z-20 bg-black px-3'>
        Hub
      </h1>
      <div className='grid 2xl:grid-cols-7 xl:grid-cols-5 md:grid-cols-4 grid-cols-2 gap-2 py-1'>
        {notes?.map((note) => <NoteCard note={note} key={note.id} />)}
      </div>
    </main>
  );
}

function NoteCard({ note }: { note: Note }) {
  const colour = Colours[note.colour];

  const props: LucideProps = {
    size: 16,
    strokeWidth: 2.25,
  };

  let icon: LucideIcon = NotebookText;

  if (note.isFavourite) icon = Star;
  else if (note.isArchived) icon = Archive;
  else if (note.isPublic) icon = Globe;

  return (
    <Link
      href={`/notes/${note.id}`}
      className='flex flex-col gap-1 p-5 lg:py-4 w-full text-black rounded-md select-none focus:outline-2 focus:outline-offset-2'
      style={{ backgroundColor: colour }}
    >
      <h3 className='font-semibold leading-loose truncate text-xl font-garamound shrink-0'>
        {note.title}
      </h3>
      <div className='flex flex-col justify-between h-full gap-1.5'>
        <p className='text-sm leading-snug overflow-x-clip xl:line-clamp-5 md:line-clamp-4 line-clamp-3'>
          {note.content}
        </p>
        <div className='text-black/60 leading-tight text-sm flex justify-between items-center'>
          <span className='leading-none'>
            {formatDateString(note.createdAt)}
          </span>
          <div>{createElement(icon, { ...props })}</div>
        </div>
      </div>
    </Link>
  );
}

function formatDateString(dateString: string): string {
  const date = new Date(dateString);

  return date.toLocaleDateString('en-GB', {
    month: 'short',
    day: '2-digit',
    year: '2-digit',
  });
}
