import { ReactNode } from 'react';

interface NoNotesProps {
  headerIcon: ReactNode;
  text: string;
  paragraphIcon: ReactNode;
  paragraph: string;
}

export default function NoNotes({
  headerIcon,
  text,
  paragraphIcon,
  paragraph,
}: NoNotesProps) {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="flex flex-col items-center text-center gap-2.5">
        {headerIcon}
        <h1 className="text-[28px] leading-normal font-semibold">{text}</h1>
        <p className="flex gap-1 text-base leading-none text-silver">
          {paragraph}
          {paragraphIcon}
        </p>
      </div>
    </div>
  );
}
