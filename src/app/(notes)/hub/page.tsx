import { getNotes } from '@/actions';
import type { PartialNote } from '@/types/Note';
import { Colours } from '@/utils/colours';
import Link from 'next/link';

export default async function HubPage() {
  const notes = await getNotes();

  return (
    <main className='p-5 overflow-x-hidden overflow-y-scroll h-full'>
      <h1 className='font-semibold text-2xl pb-6 sticky top-0 z-20 bg-black px-3'>
        Hub
      </h1>
      <div className='grid xl:grid-cols-5 md:grid-cols-3 grid-cols-2 gap-2 py-2'>
        {notes?.map((note) => <NoteCard note={note} key={note.id} />)}
      </div>
    </main>
  );
}

function NoteCard({ note }: { note: PartialNote }) {
  const colour = Colours[note.colour];

  return (
    <Link
      href={`/notes/${note.id}`}
      className='flex flex-col gap-2 p-4 w-full text-black even:rounded-tl-lg odd:rounded-tr-xl odd:rounded-bl-lg even:rounded-br-lg'
      style={{ backgroundColor: colour }}
    >
      <h3 className='font-semibold truncate'>{note.title}</h3>
      <p className='text-sm overflow-x-clip line-clamp-4'>{note.content}</p>
    </Link>
  );
}
