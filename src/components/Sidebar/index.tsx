import Logo from '@/components/Logo';
import Notes from '@/components/Note/Notes';
import More from '@/components/More';
import AddNoteButton from '@/components/Note/AddNoteButton';
import Profile from '@/components/Profile';
import ToggleSidebarButton from '@/components/Sidebar/ToggleSidebarButton';
import { cookies } from 'next/headers';

export default async function Sidebar() {
  const sidebarState = !!cookies().get('sidebar-state')?.value;

  return (
    <aside className='w-[20vw] flex flex-col pt-7 gap-7 h-screen border-r border-r-midnight'>
      <header className='flex items-center justify-between pe-5'>
        <Logo />
        <ToggleSidebarButton />
      </header>
      <section
        data-close={sidebarState}
        className='justify-center flex flex-col gap-7'
      >
        <AddNoteButton />
        <Notes />
        <More />
      </section>
      <Profile />
    </aside>
  );
}
