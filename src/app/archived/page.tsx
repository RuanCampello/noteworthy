import NoNotes from '@/components/NoNotes';
import Resizable from '@/components/Resizable';
import SubSidebar from '@/components/SubSidebar';
import { db } from '@/firebase';
import { NoteType } from '@/types/note-type';
import { getDoc, doc } from 'firebase/firestore';
import { ArchiveX, ShieldCheck } from 'lucide-react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function ArchivedPage() {
  const user_id = cookies().get('user_id')?.value;
  if (!user_id) redirect('/login');

  const response = await getDoc(doc(db, 'userArchived', user_id));
  if (!response.exists()) return null;
  console.log(response.data())

  const archivedNotes = response.data()['notes'] as NoteType[];
  return (
    <Resizable>
      <div className='flex h-full'>
        <SubSidebar notes={archivedNotes} title='Archived Notes'>
          <NoNotes
            text="You don't have any archived note"
            paragraph='Try to archive a note and keep it safe'
            headerIcon={<ArchiveX size={80} strokeWidth={1} />}
            paragraphIcon={<ShieldCheck size={16} fill='#A3A3A3' />}
          />
        </SubSidebar>
      </div>
    </Resizable>
  );
}
