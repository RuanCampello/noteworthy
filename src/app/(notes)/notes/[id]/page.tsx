import NotFound from '@/app/not-found';
import NotVisibleWarning from '@/components/NotVisibleWarning';
import NoteEditor from '@/components/Note/NoteEditor';
import NoteHeader from '@/components/Note/NoteHeader';
import { currentUser, getNoteById } from '@/queries/note';
import { getUserPreferences } from '@/server/actions/user-preferences';

type Props = { params: { id: string } };

export default async function NotePage({ params }: Props) {
  const id = params.id;

  const [note, user] = await Promise.all([getNoteById(id), currentUser()]);

  if (!note) return <NotFound />;
  const { content, title, createdAt, lastUpdate, isPublic, owner } = note;

  const isNoteVisible = user?.id === owner.id || isPublic;
  if (!isNoteVisible) return <NotVisibleWarning />;

  const preferences = await getUserPreferences(owner.id);
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
