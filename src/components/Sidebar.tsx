import Logo from './Logo';
import Notes from './Notes';
import More from './More';
import AddNoteButton from './AddNoteButton';

export default function Sidebar() {
  return (
    <div className='w-full flex flex-col py-7 gap-7'>
      <Logo />
      <div className='justify-center flex flex-col gap-7'>
        <AddNoteButton />
        <Notes />
        <More />
      </div>
    </div>
  );
}
