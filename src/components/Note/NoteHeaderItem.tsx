import { ReactNode } from 'react';

interface NoteHeaderItemProps {
  children: ReactNode;
  value: string;
  name: string;
}

export default function NoteHeaderItem({
  children,
  name,
  value,
}: NoteHeaderItemProps) {
  return (
    <div className="flex gap-1.5 items-center">
      {children}
      <span className="xl:mr-4 xl:w-fit w-20">{name}</span>
      <span className="text-neutral-100">{value}</span>
    </div>
  );
}
