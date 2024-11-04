import type { Colour, NoteFormat } from '@/types/Enums';
import { Tag } from '@/utils/constants/filters';
import { env } from '@/env';
import { Colours } from '@/utils/colours';
import Link from 'next/link';
import { currentUser } from '@/actions';

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
      <div className='grid 2xl:grid-cols-6 xl:grid-cols-5 md:grid-cols-4 grid-cols-2 gap-2 pt-1'>
        {notes?.map((note) => <NoteCard note={note} key={note.id} />)}
      </div>
    </main>
  );
}

function NoteCard({ note }: { note: Note }) {
  const colour = Colours[note.colour];

  return (
    <Link
      href={`/notes/${note.id}`}
      className='flex flex-col gap-1 p-4 w-full text-black rounded-lg select-none focus:outline-2 focus:outline-offset-2'
      style={{ backgroundColor: colour }}
    >
      <h3 className='font-semibold leading-snug truncate text-xl font-garamound'>
        {note.title}
      </h3>
      <p className='text-sm overflow-x-clip xl:line-clamp-5 line-clamp-4'>
        {note.content}
      </p>
    </Link>
  );
}
