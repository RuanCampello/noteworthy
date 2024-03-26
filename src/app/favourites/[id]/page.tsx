import NotFound from '@/app/not-found';
import SubSidebar from '@/components/SubSidebar';
import NoteEditor from '@/components/NoteEditor';
import NoteHeader from '@/components/NoteHeader';
import Resizable from '@/components/Resizable';
import { cookies } from 'next/headers';
import { retrieveNotes } from '@/utils/api';
import { NoteType } from '@/types/note-type';
import { Metadata } from 'next';

type Props = { params: { id: string } };

type FavouriteMetadataResult =
  | (Metadata & { note?: undefined; notes?: undefined })
  | (Metadata & { note: NoteType; notes: NoteType[] })
  | (Metadata & { notes: NoteType[]; note?: undefined });

export async function generateMetadata({
  params,
}: Props): Promise<FavouriteMetadataResult> {
  const id = params.id;
  const userId = cookies().get('user_id')?.value;
  if (!userId) return { title: '%s' };
  const result = await retrieveNotes({
    userId: userId,
    noteId: id,
    collection: 'userFavourites',
    returnAll: true,
    returnSingleNote: true,
  });
  if (!result) return { title: '%s' };
  const { notes, note } = result;
  if (notes) {
    if (note) {
      return { title: note.title, note, notes };
    } else return { title: '%s', notes };
  } else {
    return { title: '%s' };
  }
}
export default async function Favourite({ params }: Props) {
  const id = params.id;
  const user_id = cookies().get('user_id')?.value;
  if (!user_id) return null;
  const favouriteResult = await generateMetadata({ params: { id } });
  if (!favouriteResult) return <NotFound />;
  const { note, notes } = favouriteResult;
  if (!note || !notes) return <NotFound />;
  const { title, date, owner, uid, content, lastUpdate } = note;

  return (
    <Resizable>
      <div className='flex h-full'>
        <SubSidebar title='Favourites' notes={notes} />
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
      </div>
    </Resizable>
  );
}
