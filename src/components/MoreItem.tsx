import { LucideProps } from 'lucide-react';
import dynamicIconImports from 'lucide-react/dynamicIconImports';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ReactNode } from 'react';

interface IconProps extends LucideProps {
  name: keyof typeof dynamicIconImports;
}

interface MoreItemProps {
  href: string;
  name: string;
  icon: keyof typeof dynamicIconImports;
  children: ReactNode;
}

export default function MoreItem({ href, name, icon, children }: MoreItemProps) {
  return (
    <Link
      href={href}
      className={`py-2.5 px-5 hover:bg-midnight w-full flex items-center justify-between`}
    >
      <div className='flex gap-4 md:justify-start justify-center'>
        <Icon name={icon} size={24} className='shrink-0' />
        <span className='sm:inline truncate hidden'>{name}</span>
      </div>
      {children}
    </Link>
  );
}

function Icon({ name, ...props }: IconProps) {
  const DynamicIcon = dynamic(dynamicIconImports[name]);

  return <DynamicIcon {...props} />;
}
