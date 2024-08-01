import NotFound from '@/app/not-found';
import NotVisibleWarning from '@/components/NotVisibleWarning';
import NoteEditor from '@/components/Note/NoteEditor';
import NoteHeader from '@/components/Note/NoteHeader';
import { currentUser } from '@/queries/note';
import { API } from '@/server/api';

type Props = { params: { id: string } };

export default async function Archived({ params }: Props) {
  const [user, note] = await Promise.all([
    await currentUser(),
    await new API().note.get(params.id),
  ]);
  if (!note || !user) return <NotFound />;

  const { content, title, createdAt, id, lastUpdate, isPublic, owner } = note;
  const { preferences } = owner;

  const isNoteVisible = user.id === owner.id || isPublic;
  if (!isNoteVisible) return <NotVisibleWarning />;

  const fullNote =
    preferences?.fullNote !== undefined ? preferences.fullNote : true;

  return (
    <div className='w-full pb-6 overflow-y-clip flex flex-col'>
      <NoteEditor fullNote={fullNote} content={content} owner={owner.id}>
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
