import { ReactNode } from 'react';

interface PlaceholderProps {
  children: ReactNode;
  text: string;
}

export default function Placeholder({ children, text }: PlaceholderProps) {
  return (
    <div className='flex flex-col gap-2.5 justify-center items-center h-full w-full'>
      {children}
      <h1 className='text-[28px] leading-normal font-semibold'>
        {text}
      </h1>
      <p className='text-base w-[460px] text-center text-white/60'>
        Choose a note from the list on the left to view its contents, or create
        a new note to add to your collection.
      </p>
    </div>
  );
}
