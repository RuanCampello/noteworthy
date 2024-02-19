import NoteHeader from '@/components/NoteHeader';
import Resizable from '@/components/Resizable';

export default function NotePage({ params }: { params: { id: number } }) {
  return (
    <Resizable>
      <div className='px-14 py-12'>
        <NoteHeader
          title='Reflection on the Mouth of June'
          date='21/06/2022'
          owner='Figma'
        />
      </div>
    </Resizable>
  );
}