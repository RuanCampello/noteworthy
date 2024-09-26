import NotFound from '@/app/not-found';
import NotVisibleWarning from '@/components/NotVisibleWarning';
import NoteEditor from '@/components/Note/NoteEditor';
import NoteHeader from '@/components/Note/NoteHeader';
import { env } from '@/env';
import { currentUser } from '@/actions';
import { Note } from '@/types/Note';
import { headers } from 'next/headers';

type Props = { params: { id: string } };

export default async function NotePage({ params }: Props) {
  const user = await currentUser();
  const response = await fetch(`${env.INK_HOSTNAME}/notes/${params.id}`, {
    method: 'get',
    headers: { Authorization: `Bearer ${user?.accessToken}` },
    next: { tags: ['note-page'], revalidate: false },
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
        isEditable={note.userId === user.id}
        content={note.content}
      >
        <NoteHeader note={note} />
      </NoteEditor>
    </article>
  );
}
