import { ReactNode } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Archive, Star, Trash } from 'lucide-react';
import { Separator } from './ui/separator';
import DeleteNoteDialog from './DeleteNoteDialog';

interface DropdownProps {
  children: ReactNode;
}

export default function Dropdown({ children }: DropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent
        align='end'
        sideOffset={14}
        className='bg-night text-neutral-100 border-none gap-3 w-52 flex flex-col p-3 rounded-md'
      >
        <DropdownMenuItem className='gap-3 text-base active:bg-sunset group'>
          <Star
            size={20}
            className='group-hover:scale-105 transition-transform duration-200 group-active:scale-95'
          />
          Favourite
        </DropdownMenuItem>
        <DropdownMenuItem className='gap-3 text-base active:bg-mindaro group'>
          <Archive
            size={20}
            className='group-hover:scale-105 transition-transform duration-200 group-active:scale-95'
          />
          Archive
        </DropdownMenuItem>
        <Separator className='bg-white/40' />
        <DeleteNoteDialog>
          <button className='gap-3 flex p-2 items-center rounded-sm text-base active:text-black active:bg-melon focus:bg-melon focus:text-black hover:bg-melon hover:text-black group'>
            <Trash
              size={20}
              className='group-hover:scale-105 transition-transform duration-200 group-active:scale-95'
            />
            <span>Delete</span>
          </button>
        </DeleteNoteDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
