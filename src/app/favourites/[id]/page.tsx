import Resizable from '@/components/Resizable';

type Props = { params: { id: string } };

export default async function Favourite({ params }: Props) {
  return (
    <Resizable>
      <div className='flex h-full'>
        {/* <SubSidebar title='Favourites' notes={notes} />
        <div className='w-full px-8 py-6 overflow-y-clip flex flex-col gap-4'>
          <NoteEditor content={content}>
            <NoteHeader
              title={title}
              date={date.seconds}
              owner={owner}
              id={uid}
              lastUpdate={lastUpdate?.seconds}
            />
          </NoteEditor> 
        </div>
          */}
      </div>
    </Resizable>
  );
}
