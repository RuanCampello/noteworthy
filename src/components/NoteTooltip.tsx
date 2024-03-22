import { ReactNode } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';

type SimpleNote = {
  title: string;
  colour: string;
};

interface NoteTooltipProps {
  children: ReactNode;
  note: SimpleNote;
}

export default function NoteTooltip({ children, note }: NoteTooltipProps) {
  const { title, colour } = note;
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          align='center'
          side='right'
          className='max-w-52 border-black border-2 lg:-translate-x-[20%]'
          style={{ background: colour }}
        >
          <h1 className='text-lg font-medium truncate'>{title}</h1>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
