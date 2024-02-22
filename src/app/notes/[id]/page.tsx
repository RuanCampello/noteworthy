import NoteEditor from '@/components/NoteEditor';
import NoteHeader from '@/components/NoteHeader';
import Resizable from '@/components/Resizable';
import { db } from '@/firebase';
import { NoteType } from '@/types/note-type';
import { doc, getDoc } from 'firebase/firestore';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function NotePage({ params }: { params: { id: string } }) {
  const user_id = cookies().get('user_id')?.value
  if(!user_id) redirect('/login')

  const { id } = params
  const noteRef = doc(db, 'userNotes', user_id.toString())
  const noteDoc = await getDoc(noteRef)
  if(!noteDoc.exists()) return null
  const noteData = noteDoc.data()
  const note: NoteType = noteData.notes.find((note: NoteType) => note.uid === id)
  return (
    <Resizable>
      <div className='px-14 py-12 flex flex-col gap-4 h-full overflow-y-clip'>
        <NoteHeader
          title={note.title}
          date={note.date.seconds}
          owner={note.owner}
        />
        <NoteEditor />
      </div>
    </Resizable>
  );
}
