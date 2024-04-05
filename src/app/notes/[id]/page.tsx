import NotFound from '@/app/not-found';
import NoteEditor from '@/components/NoteEditor';
import NoteHeader from '@/components/NoteHeader';
import Resizable from '@/components/Resizable';
import { getNoteById } from '@/data/note';
import { getUserById } from '@/data/user';

type Props = { params: { id: string } };

export default async function NotePage({ params }: Props) {
  const id = params.id;
  const note = await getNoteById(id);
  if (!note) return <NotFound />;
  const { content, title, createdAt, userId, lastUpdate } = note;
  const owner = await getUserById(userId);
  if (!owner) return <NotFound />;

  return (
    <Resizable>
      <div className='flex flex-col gap-3 h-full overflow-y-clip'>
        <NoteEditor content={content}>
          <NoteHeader
            id={id}
            title={title}
            date={createdAt}
            owner={owner.name!}
            lastUpdate={lastUpdate || createdAt}
          />
        </NoteEditor>
      </div>
    </Resizable>
  );
}
