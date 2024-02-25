import { ReactNode } from 'react';

interface SectionTitleProps {
  title: string;
  children?: ReactNode;
}

export default function SectionTitle({ title, children }: SectionTitleProps) {
  return (
    <h2 className='text-[15px] px-5 leading-normal font-semibold text-silver mb-2 flex items-center justify-between'>
      <span>{title}</span>
      <div>{children}</div>
    </h2>
  );
}
