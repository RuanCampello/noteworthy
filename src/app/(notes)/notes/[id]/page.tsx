import NotFound from '@/app/not-found';
import NotVisibleWarning from '@/components/NotVisibleWarning';
import NoteEditor from '@/components/Note/NoteEditor';
import NoteHeader from '@/components/Note/NoteHeader';
import { currentUser } from '@/queries/note';
import { Note } from '@/types/Note';
import { headers } from 'next/headers';

type Props = { params: { id: string } };

export default async function NotePage({ params }: Props) {
  const user = await currentUser();
  const response = await fetch(`http://localhost:6969/notes/${params.id}`, {
    method: 'get',
    headers: { Authorization: `Bearer ${user?.accessToken}` },
    next: { tags: ['note-page'] },
    cache: 'force-cache',
  });
  const note: Note = await response.json();

  if (!user || !note) return <NotFound />;
  const isNoteVisible = user.id === note.userId || note.isPublic;
  if (!isNoteVisible) return <NotVisibleWarning />;

  const fullNote = note?.fullNote !== undefined ? note.fullNote : true;
  const isSubView = !headers().get('pathname')?.includes('/notes/');

  return (
    <article data-view={isSubView} className='mx-40 data-[view=true]:mx-28'>
      <NoteEditor
        fullNote={fullNote}
        owner={note.userId}
        content={note.content}
      >
        <NoteHeader note={note} />
      </NoteEditor>
    </article>
  );
}
