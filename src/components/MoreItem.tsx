import { LucideProps } from 'lucide-react';
import dynamicIconImports from 'lucide-react/dynamicIconImports';
import dynamic from 'next/dynamic';
import Link from 'next/link';

interface IconProps extends LucideProps {
  name: keyof typeof dynamicIconImports;
}

interface MoreItemProps {
  href: string;
  name: string;
  icon: keyof typeof dynamicIconImports;
}

export default function MoreItem({ href, name, icon }: MoreItemProps) {
  return (
    <Link
      href={href}
      className='py-2.5 px-5 hover:bg-midnight w-full flex gap-4 md:justify-start justify-center'
    >
      <Icon name={icon} size={24} className='shrink-0' />
      <span className='sm:inline truncate hidden'>{name}</span>
    </Link>
  );
}

function Icon({name, ...props}: IconProps) {
  const DynamicIcon = dynamic(dynamicIconImports[name])

  return <DynamicIcon {...props} />
}