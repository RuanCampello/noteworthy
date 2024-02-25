import { Sparkles, StarOff } from 'lucide-react';

export default function NoFavourite() {
  return (
    <div className='w-full h-full flex items-center justify-center'>
      <div className='flex flex-col items-center text-center gap-2.5'>
        <StarOff size={80} strokeWidth={1} />
        <h1 className='text-[28px] leading-normal font-semibold'>
          You don&apos;t have any favourite note
        </h1>
        <p className='flex text-base text-silver'>
          Choose a note to favourite and make it sparkle!
          <Sparkles size={20} fill='#A3A3A3' />
        </p>
      </div>
    </div>
  );
}
