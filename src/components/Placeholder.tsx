import { ReactNode } from 'react';

interface PlaceholderProps {
  children: ReactNode;
  text: string;
  paragraph: string;
}

export default function Placeholder({
  children,
  text,
  paragraph,
}: PlaceholderProps) {
  return (
    <div className='flex flex-col gap-2.5 justify-center items-center h-full w-full'>
      {children}
      <h1 className='text-[28px] leading-normal font-semibold'>{text}</h1>
      <p className='text-base w-[460px] text-center text-white/60'>
        {paragraph}
      </p>
    </div>
  );
}
