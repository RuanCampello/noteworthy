import { TooltipContentProps } from '@radix-ui/react-tooltip';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { ReactNode } from 'react';

interface TooltipProps extends TooltipContentProps {
  children: ReactNode;
  content: string;
}

export default function MenuTooltip({ children, content, ...props }: TooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent sideOffset={props.sideOffset || 4} className='bg-midnight border-white/40 text-neutral-200 font-medium'>
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
