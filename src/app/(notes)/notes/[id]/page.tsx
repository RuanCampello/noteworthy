import NotFound from '@/app/not-found';
import NotVisibleWarning from '@/components/NotVisibleWarning';
import NoteEditor from '@/components/Note/NoteEditor';
import NoteHeader, { Owner } from '@/components/Note/NoteHeader';
import { currentUser, getNoteById } from '@/queries/note';
import { getUserById } from '@/server/queries/user';

type Props = { params: { id: string } };

export default async function NotePage({ params }: Props) {
  const id = params.id;

  const note = await getNoteById(id);
  if (!note) return <NotFound />;
  const owner = await getUserById(note.userId);
  if (!owner) return <NotFound />;

  const { content, title, createdAt, lastUpdate, isPublic } = note;

  const user = await currentUser();
  const isNoteVisible = user?.id === owner.id || isPublic;
  if (!isNoteVisible) return <NotVisibleWarning />;

  const resumedOwner: Owner = {
    name: owner.name,
    id: owner.id,
  };

  return (
    <NoteEditor
      owner={owner.id}
      content={content}
    >
      <NoteHeader
        id={id}
        title={title}
        date={createdAt}
        owner={resumedOwner}
        lastUpdate={lastUpdate || createdAt}
      />
    </NoteEditor>
  );
}
