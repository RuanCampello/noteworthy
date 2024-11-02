'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { cloneElement } from 'react';

interface MoreItemProps {
  name: string;
  icon: JSX.Element;
  colour: string;
  path?: string;
  children?: ReactNode;
}

export default function MoreItem({
  name,
  icon,
  colour,
  path,
  children,
}: MoreItemProps) {
  const pathname = usePathname();
  const active = path ? pathname?.includes(path) : false;

  const iconStroke = active ? colour : '#A3A3A3';
  const iconFill = active ? '#333333' : '#181818';

  return (
    <div
      role='button'
      className='py-1.5 px-5 hover:bg-midnight w-full flex items-center sm:justify-between justify-center group focus:outline-none group-data-[state=closed]/root:justify-center group-data-[state=closed]/root:data-[active=true]:bg-midnight'
    >
      <div className='flex gap-2 items-center'>
        {cloneElement(icon, {
          className: 'shrink-0 w-5 h-5',
          strokeWidth: 2.5,
          stroke: iconStroke,
          fill: iconFill,
        })}
        <span className='sm:inline truncate hidden text-base group-data-[state=closed]/root:hidden text-silver select-none'>
          {name}
        </span>
      </div>
      {children}
    </div>
  );
}
