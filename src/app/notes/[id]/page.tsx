import NotFound from '@/app/not-found';
import NoteEditor from '@/components/NoteEditor';
import NoteHeader from '@/components/NoteHeader';
import Resizable from '@/components/Resizable';
import { NoteType } from '@/types/note-type';
import { findNote } from '@/utils/api';
import { Metadata } from 'next';

type Props = { params: { id: string } };


export default async function NotePage({ params }: Props) {
  return (
    // <Resizable>
    //   <div className='flex flex-col gap-3 h-full overflow-y-clip'>
    //     <NoteEditor content={content}>
    //       <NoteHeader
    //         id={id}
    //         title={title}
    //         date={date.seconds}
    //         owner={owner}
    //         lastUpdate={lastUpdate?.seconds}
    //       />
    //     </NoteEditor>
    //   </div>
    // </Resizable>
    <div>note</div>
  );
}
