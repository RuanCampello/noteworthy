import { cloneElement } from 'react';
import MenuTooltip from './Tooltip';
import { cn } from '@/lib/utils';

interface StatusTooltipProps extends React.HTMLAttributes<HTMLDivElement> {
  content: string;
  icon: JSX.Element;
}

export default function StatusTooltip({
  content,
  icon,
  ...props
}: StatusTooltipProps) {
  return (
    <MenuTooltip side='left' sideOffset={6} content={content}>
      <div
        className={cn(
          'p-1.5 rounded-sm shrink-0 hover:border-white text-black border-2 border-transparent transition-colors cursor-help',
          props.className,
        )}
      >
        {cloneElement(icon, { size: 20 })}
      </div>
    </MenuTooltip>
  );
}
