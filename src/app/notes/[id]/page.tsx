import NotFound from '@/app/not-found';
import NoteEditor from '@/components/NoteEditor';
import NoteHeader from '@/components/NoteHeader';
import Resizable from '@/components/Resizable';
import { NoteType } from '@/types/note-type';
import { findNote } from '@/utils/api';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

type Props = { params: { id: string } };

export async function generateMetadata({
  params,
}: Props): Promise<Metadata & { note: NoteType | null }> {
  const id = params.id;
  const userId = cookies().get('user_id')?.value;
  if (!userId) return { title: 'Noteworthy', note: null };
  const note = await findNote(userId, 'userNotes', id);
  if (note) return { title: note.title, note };
  else return { title: 'Noteworhy', note: null };
}

export default async function NotePage({ params }: Props) {
  const userId = cookies().get('user_id')?.value;
  if (!userId) redirect('/login');

  const id = params.id;
  const { note } = await generateMetadata({ params: { id } });
  if (!note) return <NotFound />;
  const { title, date, owner, content, lastUpdate } = note;
  return (
    <Resizable>
      <div className='flex flex-col gap-3 h-full overflow-y-clip'>
        <NoteEditor content={content}>
          <NoteHeader
            id={id}
            title={title}
            date={date.seconds}
            owner={owner}
            lastUpdate={lastUpdate?.seconds}
          />
        </NoteEditor>
      </div>
    </Resizable>
  );
}
