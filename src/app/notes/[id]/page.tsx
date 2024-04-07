import NotFound from '@/app/not-found';
import { Loading } from '@/components/Loading';
import NoteEditor from '@/components/Note/NoteEditor';
import NoteHeader from '@/components/Note/NoteHeader';
import Resizable from '@/components/Resizable';
import { getNoteById } from '@/data/note';
import { getUserById } from '@/data/user';
import { Suspense } from 'react';

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
      <Suspense fallback={<Loading />}>
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
      </Suspense>
    </Resizable>
  );
}
