import { TooltipContentProps } from '@radix-ui/react-tooltip';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface TooltipProps extends TooltipContentProps {
  children: ReactNode;
  content: string;
}

export default function MenuTooltip({
  children,
  content,
  ...props
}: TooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          sideOffset={props.sideOffset || 4}
          className={cn(
            'bg-midnight border-white/40 text-neutral-200 font-medium',
            props.className,
          )}
          {...props}
        >
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
