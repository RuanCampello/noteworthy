import { LucideProps } from 'lucide-react';
import dynamicIconImports from 'lucide-react/dynamicIconImports';
import dynamic from 'next/dynamic';
import { headers } from 'next/headers';
import Link from 'next/link';
import { ReactNode } from 'react';

interface IconProps extends LucideProps {
  name: keyof typeof dynamicIconImports;
}

interface MoreItemProps {
  href: string;
  name: string;
  icon: keyof typeof dynamicIconImports;
  colour: string;
  children: ReactNode;
}

export default function MoreItem({
  href,
  name,
  icon,
  colour,
  children,
}: MoreItemProps) {
  const active = headers().get('pathname')?.includes(href);
  
  return (
    <Link
      href={href}
      className={`py-2.5 px-5 hover:bg-midnight w-full flex items-center sm:justify-between justify-center group focus:outline-none group-data-[state=closed]/root:justify-center`}
    >
      <div className='flex gap-4'>
        <Icon
          name={icon}
          size={24}
          className='shrink-0'
          stroke={active ? colour : '#fff'}
          fill={active ? '#333333' : '#181818'}
        />
        <span className='sm:inline truncate hidden group-data-[state=closed]/root:hidden'>
          {name}
        </span>
      </div>
      {children}
    </Link>
  );
}

function Icon({ name, ...props }: IconProps) {
  const DynamicIcon = dynamic(dynamicIconImports[name]);

  return <DynamicIcon {...props} />;
}
