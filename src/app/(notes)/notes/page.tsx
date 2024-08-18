import NoteWidget from '@/components/Note/NoteWidget';
import { API } from '@/server/api';
import { currentUser } from '@/server/queries/note';

export default async function NotesPage() {
  const user = await currentUser();
  if (!user || !user.id) return;

  const allNotes = await new API().notes(user.id).all.get();

  return (
    <main className='p-5'>
      <h2 className='text-2xl font-semibold mb-5'>All notes</h2>
      <section className='grid grid-flow-col gap-3 auto-cols-max'>
        {allNotes.map((note) => (
          <NoteWidget key={note.id} {...note} />
        ))}
      </section>
    </main>
  );
}
