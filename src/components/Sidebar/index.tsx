import Logo from '@/components/Logo';
import Notes from '@/components/Note/Notes';
import More from '@/components/More';
import AddNoteButton from '@/components/Note/AddNoteButton';
import Profile from '@/components/Profile';
import ToggleSidebarButton from '@/components/Sidebar/ToggleSidebarButton';
import Root from './Root';

import { getUserPreferences } from '@/server/actions/user-preferences';
import { currentUser } from '@/server/queries/note';
import type { NoteFormat } from '@prisma/client';

export default async function Sidebar() {
  const user = await currentUser();

  if (!user || !user.id) return;

  let format: NoteFormat = 'full';
  const preferences = await getUserPreferences(user.id);
  if (preferences) format = preferences.noteFormat;
  return (
    <Root>
      <header className='flex items-center group-data-[state=open]/root:justify-between group-data-[state=open]/root:pe-5 justify-center w-full'>
        <Logo />
        <ToggleSidebarButton />
      </header>
      <section
        className='justify-center flex flex-col gap-7 w-full group/format'
        data-format={format}
      >
        <AddNoteButton />
        <Notes />
        <More />
      </section>
      <Profile />
    </Root>
  );
}
