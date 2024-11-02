import { getUserWithPreferences } from '@/actions';
import Logo from '@/components/Logo';
import Menu from '@/components/Sidebar/Menu';
import AddNoteButton from '@/components/Sidebar/AddNoteButton';
import Notes from '@/components/Note/Notes';
import Profile from '@/components/Profile';
import ToggleSidebarButton from '@/components/Sidebar/ToggleSidebarButton';
import SearchButton from './SearchButton';
import Root from './Root';

export default async function Sidebar() {
  const { user, preferences } = await getUserWithPreferences();
  if (!user) return;

  return (
    <Root>
      <header className='flex items-center group-data-[state=open]/root:justify-between group-data-[state=open]/root:pe-5 justify-center w-full'>
        <Logo />
        <ToggleSidebarButton />
      </header>
      <section
        className='justify-center flex flex-col gap-5 w-full group/format'
        data-format={preferences?.noteFormat ?? 'full'}
      >
        <div className='group-data-[state=closed]/root:flex-col flex w-full gap-2 group-data-[state=open]/root:px-5 items-center'>
          <AddNoteButton />
          <SearchButton />
        </div>
        <Notes />
        <Menu />
      </section>
      <Profile />
    </Root>
  );
}
