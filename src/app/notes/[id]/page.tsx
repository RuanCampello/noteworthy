import NotFound from '@/app/not-found';
import NoteEditor from '@/components/Note/NoteEditor';
import NoteHeader, { Owner } from '@/components/Note/NoteHeader';
import { getNoteById } from '@/queries/note';
import { getUserById } from '@/queries/user';

type Props = { params: { id: string } };

export default async function NotePage({ params }: Props) {
  const id = params.id;
  const note = await getNoteById(id);
  if (!note) return <NotFound />;
  const { content, title, createdAt, userId, lastUpdate } = note;
  const owner = await getUserById(userId);
  if (!owner) return <NotFound />;

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
