import Logo from './Logo';
import Notes from './Note/Notes';
import More from './More';
import AddNoteButton from './Note/AddNoteButton';
import Profile from './Profile';

export default function Sidebar() {
  return (
    <div className='w-[20vw] flex flex-col pt-7 gap-7 h-screen border-r border-r-midnight'>
      <Logo />
      <div className='justify-center flex flex-col gap-7'>
        <AddNoteButton />
        <Notes />
        <More />
      </div>
      <Profile />
    </div>
  );
}
