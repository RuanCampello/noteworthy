import { TooltipTrigger } from '@radix-ui/react-tooltip';
import { Tooltip, TooltipContent, TooltipProvider } from './ui/tooltip';
import { ReactNode } from 'react';

interface TooltipProps {
  children: ReactNode;
  content: string;
}

export default function MenuTooltip({ children, content }: TooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent className='bg-midnight border-white/40 text-neutral-200 font-medium'>
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
