import NotFound from '@/app/not-found';
import NoteEditor from '@/components/Note/NoteEditor';
import NoteHeader, { Owner } from '@/components/Note/NoteHeader';
import { getNoteById } from '@/data/note';
import { getUserById } from '@/data/user';

type Props = { params: { id: string } };

export default async function Favourite({ params }: Props) {
  const note = await getNoteById(params.id);
  if (!note) return <NotFound />;
  const { content, title, createdAt, id, lastUpdate, userId } = note;
  const owner = await getUserById(userId);
  if (!owner) return;

  const ownerResumed: Owner = {
    name: owner.name,
    id: owner.id,
  };

  return (
    <div className='w-full pb-6 overflow-y-clip flex flex-col gap-4'>
      <NoteEditor owner={owner.name} content={content}>
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
