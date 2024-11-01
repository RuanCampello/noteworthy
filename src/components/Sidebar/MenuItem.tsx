import { LucideProps } from 'lucide-react';
import dynamicIconImports from 'lucide-react/dynamicIconImports';
import dynamic from 'next/dynamic';
import { headers } from 'next/headers';
import { ReactNode } from 'react';

interface IconProps extends LucideProps {
  name: keyof typeof dynamicIconImports;
}

interface MoreItemProps {
  name: string;
  icon: keyof typeof dynamicIconImports;
  colour: string;
  active?: boolean;
  children?: ReactNode;
}

export default function MoreItem({
  name,
  icon,
  colour,
  active,
  children,
}: MoreItemProps) {
  const iconStroke = active ? colour : '#A3A3A3';
  const iconFill = active ? '#333333' : '#181818';

  return (
    <div
      role='button'
      data-active={!!active}
      className='py-1.5 px-5 hover:bg-midnight w-full flex items-center sm:justify-between justify-center group focus:outline-none group-data-[state=closed]/root:justify-center group-data-[state=closed]/root:data-[active=true]:bg-midnight'
    >
      <div className='flex gap-2 items-center'>
        <Icon
          name={icon}
          size={20}
          className='shrink-0'
          strokeWidth={2.5}
          stroke={iconStroke}
          fill={iconFill}
        />
        <span className='sm:inline truncate hidden text-base group-data-[state=closed]/root:hidden text-silver select-none'>
          {name}
        </span>
      </div>
      {children}
    </div>
  );
}

function Icon({ name, ...props }: IconProps) {
  const DynamicIcon = dynamic(dynamicIconImports[name]);

  return <DynamicIcon {...props} />;
}
