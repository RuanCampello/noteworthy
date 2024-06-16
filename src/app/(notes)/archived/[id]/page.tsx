import NotFound from '@/app/not-found';
import NotVisibleWarning from '@/components/NotVisibleWarning';
import NoteEditor from '@/components/Note/NoteEditor';
import NoteHeader, { Owner } from '@/components/Note/NoteHeader';
import { currentUser, getNoteById } from '@/queries/note';
import { getUserById } from '@/queries/user';

type Props = { params: { id: string } };

export default async function Archived({ params }: Props) {
  const note = await getNoteById(params.id);
  if (!note) return <NotFound />;
  const { content, title, createdAt, id, lastUpdate, userId, isPublic } = note;
  const owner = await getUserById(userId);
  if (!owner) return;

  const user = await currentUser();
  const isNoteVisible = user?.id === owner.id || isPublic;
  if (!isNoteVisible) return <NotVisibleWarning />;

  const ownerResumed: Owner = {
    name: owner.name,
    id: owner.id,
  };

  return (
    <div className='w-full pb-6 overflow-y-clip flex flex-col'>
      <NoteEditor
        content={content}
        owner={owner.id}
      >
        <NoteHeader
          title={title}
          date={createdAt}
          owner={ownerResumed}
          id={id}
          lastUpdate={lastUpdate || createdAt}
        />
      </NoteEditor>
    </div>
  );
}
