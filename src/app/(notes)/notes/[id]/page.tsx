import NotFound from '@/app/not-found';
import NotVisibleWarning from '@/components/NotVisibleWarning';
import NoteEditor from '@/components/Note/NoteEditor';
import NoteHeader from '@/components/Note/NoteHeader';
import { currentUser } from '@/queries/note';
import { API } from '@/server/api';

type Props = { params: { id: string } };

export default async function NotePage({ params }: Props) {
  const [user, note] = await Promise.all([
    await currentUser(),
    await new API().note.get(params.id),
  ]);

  if (!user || !note) return <NotFound />;

  const { id, content, title, createdAt, lastUpdate, isPublic, owner } = note;
  const { preferences } = owner;

  const isNoteVisible = user.id === owner.id || isPublic;
  if (!isNoteVisible) return <NotVisibleWarning />;

  const fullNote =
    preferences?.fullNote !== undefined ? preferences.fullNote : true;

  return (
    <NoteEditor fullNote={fullNote} owner={owner.id} content={content}>
      <NoteHeader
        id={id}
        title={title}
        date={createdAt}
        owner={owner}
        lastUpdate={lastUpdate || createdAt}
      />
    </NoteEditor>
  );
}
