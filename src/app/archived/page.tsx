import NoNotes from '@/components/Note/NoNotes';
import Resizable from '@/components/Resizable';
import SubSidebar from '@/components/SubSidebar';
import { ArchiveX, ShieldCheck } from 'lucide-react';

export default async function ArchivedPage() {;
  return (
    <Resizable>
      <div className='flex h-full'>
        {/* <SubSidebar notes={archivedNotes} title='Archived Notes'>
          <NoNotes
            text="You don't have any archived note"
            paragraph='Try to archive a note and keep it safe'
            headerIcon={<ArchiveX size={80} strokeWidth={1} />}
            paragraphIcon={<ShieldCheck size={16} fill='#A3A3A3' />}
          />
        </SubSidebar> */}
      </div>
    </Resizable>
  );
}
