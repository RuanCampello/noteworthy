import Logo from '@/components/Logo';
import More from '@/components/More';
import AddNoteButton from '@/components/Note/AddNoteButton';
import Notes from '@/components/Note/Notes';
import Profile from '@/components/Profile';
import ToggleSidebarButton from '@/components/Sidebar/ToggleSidebarButton';
import { getUserWithPreferences } from '@/actions';
import Root from './Root';

export default async function Sidebar() {
  const { user, preferences } = await getUserWithPreferences();
  if (!user) return;

  console.debug('preferences', preferences);

  return (
    <Root>
      <header className='flex items-center group-data-[state=open]/root:justify-between group-data-[state=open]/root:pe-5 justify-center w-full'>
        <Logo />
        <ToggleSidebarButton />
      </header>
      <section
        className='justify-center flex flex-col gap-7 w-full group/format'
        data-format={preferences?.noteFormat ?? 'full'}
      >
        <AddNoteButton />
        <Notes />
        <More />
      </section>
      <Profile />
    </Root>
  );
}
