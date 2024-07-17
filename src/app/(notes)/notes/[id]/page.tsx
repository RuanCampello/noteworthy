import NotFound from '@/app/not-found';
import NotVisibleWarning from '@/components/NotVisibleWarning';
import NoteEditor from '@/components/Note/NoteEditor';
import NoteHeader from '@/components/Note/NoteHeader';
import { currentUser, getNoteById } from '@/queries/note';

type Props = { params: { id: string } };

export default async function NotePage({ params }: Props) {
  const id = params.id;

  const note = await getNoteById(id);
  if (!note) return <NotFound />;

  const { content, title, createdAt, lastUpdate, isPublic, owner } = note;

  const user = await currentUser();
  const isNoteVisible = user?.id === owner.id || isPublic;
  if (!isNoteVisible) return <NotVisibleWarning />;

  return (
    <NoteEditor owner={owner.id} content={content}>
      <NoteHeader
        id={id}
        title={title}
        date={createdAt}
        owner={owner}
        lastUpdate={lastUpdate || createdAt}
      />
    </NoteEditor>
  );
}
