import Logo from '@/components/Logo';
import Notes from '@/components/Note/Notes';
import More from '@/components/More';
import AddNoteButton from '@/components/Note/AddNoteButton';
import Profile from '@/components/Profile';
import ToggleSidebarButton from '@/components/Sidebar/ToggleSidebarButton';
import { useSidebarState } from '@/utils/sidebar';
import { getUserPreferences } from '@/server/actions/user-preferences';
import { currentUser } from '@/server/queries/note';
import { NoteFormat } from '@prisma/client';

export default async function Sidebar() {
  const state = useSidebarState();
  const user = await currentUser();

  if (!user || !user.id) return;

  let format: NoteFormat = 'full';
  const preferences = await getUserPreferences(user.id);
  if (preferences) format = preferences.noteFormat;
  return (
    <aside
      data-state={state}
      data-format={format}
      className='2xl:w-[18vw] w-[20vw] shrink-0 grow-0 flex flex-col pt-7 gap-7 h-screen border-r border-r-midnight data-[state=closed]:w-[4vw] overflow-x-hidden data-[state=closed]:items-center group/root transition-all data-[state=open]:duration-500 duration-200'
    >
      <header className='flex items-center group-data-[state=open]/root:justify-between group-data-[state=open]/root:pe-5 justify-center w-full'>
        {state === 'open' && <Logo />}
        <ToggleSidebarButton />
      </header>
      <section className='justify-center flex flex-col gap-7 w-full'>
        <AddNoteButton />
        <Notes />
        <More />
      </section>
      <Profile />
    </aside>
  );
}
