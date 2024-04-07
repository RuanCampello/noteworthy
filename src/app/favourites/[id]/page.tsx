import NotFound from '@/app/not-found';
import { Loading } from '@/components/Loading';
import NoteEditor from '@/components/NoteEditor';
import NoteHeader from '@/components/NoteHeader';
import { getNoteById } from '@/data/note';
import { getUserById } from '@/data/user';
import { Suspense } from 'react';

type Props = { params: { id: string } };

export default async function Favourite({ params }: Props) {
  const note = await getNoteById(params.id);
  if (!note) return <NotFound />;
  const { content, title, createdAt, id, lastUpdate, userId } = note;
  const onwer = await getUserById(userId);

  return (
    <div className='w-full py-6 overflow-y-clip flex flex-col gap-4'>
      <Suspense fallback={<Loading />}>
        <NoteEditor content={content}>
          <NoteHeader
            title={title}
            date={createdAt}
            owner={onwer?.name || ''}
            id={id}
            lastUpdate={lastUpdate || createdAt}
          />
        </NoteEditor>
      </Suspense>
    </div>
  );
}
