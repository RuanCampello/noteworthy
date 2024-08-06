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

  const noteWithOwner = {
    ...note,
    owner: {
      id: note.user.id,
      name: note.user.name!,
    },
  };
  const { usersPreferences: preferences } = note.user;

  const isNoteVisible = user.id === note.user.id || note.isPublic;
  if (!isNoteVisible) return <NotVisibleWarning />;

  const fullNote =
    preferences?.fullNote !== undefined ? preferences.fullNote : true;

  return (
    <NoteEditor fullNote={fullNote} owner={note.user.id} content={note.content}>
      <NoteHeader note={noteWithOwner} />
    </NoteEditor>
  );
}
