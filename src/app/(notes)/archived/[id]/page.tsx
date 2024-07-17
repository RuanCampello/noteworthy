import NotFound from '@/app/not-found';
import NotVisibleWarning from '@/components/NotVisibleWarning';
import NoteEditor from '@/components/Note/NoteEditor';
import NoteHeader from '@/components/Note/NoteHeader';
import { currentUser, getNoteById } from '@/queries/note';

type Props = { params: { id: string } };

export default async function Archived({ params }: Props) {
  const note = await getNoteById(params.id);
  if (!note) return <NotFound />;
  const { content, title, createdAt, id, lastUpdate, isPublic, owner } = note;

  const user = await currentUser();
  const isNoteVisible = user?.id === owner.id || isPublic;
  if (!isNoteVisible) return <NotVisibleWarning />;

  return (
    <div className="w-full pb-6 overflow-y-clip flex flex-col">
      <NoteEditor content={content} owner={owner.id}>
        <NoteHeader
          title={title}
          date={createdAt}
          owner={owner}
          id={id}
          lastUpdate={lastUpdate || createdAt}
        />
      </NoteEditor>
    </div>
  );
}
