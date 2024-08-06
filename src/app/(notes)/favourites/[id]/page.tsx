import NotePage from '@/app/(notes)/notes/[id]/page';

type Props = { params: { id: string } };

export default async function Favourite({ params }: Props) {
  return (
    <div className='w-full pb-6 overflow-y-clip flex flex-col'>
      <NotePage params={params} />
    </div>
  );
}
