import { ReactNode, cloneElement } from 'react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from './ui/context-menu';
import { Archive, Pencil, Star, Trash } from 'lucide-react';
import { ColourType, Colours } from '@/utils/colours';
import { Timestamp } from 'firebase/firestore';
import { secondsToLocaleDateLong } from '@/utils/date';

interface NoteContextMenuProps {
  children: ReactNode;
  title: string;
  colour: ColourType;
  owner: string;
  lastUpdate: Timestamp;
}

type Action = { name: string; action: () => Promise<void>; icon: JSX.Element };

export default async function NoteContextMenu({
  children,
  title,
  colour,
  owner,
  lastUpdate,
}: NoteContextMenuProps) {
  const actions: Action[] = [
    { name: 'Add to Favourites', action: handleFavourite, icon: <Star /> },
    { name: 'Move to Archive', action: handleArchive, icon: <Archive /> },
    { name: 'Edit', action: handleEdit, icon: <Pencil /> },
    { name: 'Delete', action: handleArchive, icon: <Trash /> },
  ];

  const colourValue = Colours[colour];
  const lastUpdateDate = secondsToLocaleDateLong(lastUpdate?.seconds);

  async function handleFavourite() {
    'use server';
  }
  async function handleEdit() {
    'use server';
  }
  async function handleArchive() {
    'use server';
  }
  async function handleDelete() {
    'use server';
  }
  return (
    <ContextMenu>
      <ContextMenuTrigger className='flex'>{children}</ContextMenuTrigger>
      <ContextMenuContent
        className='dark bg-black border-2 shadow-md shadow-black/70 w-48'
        style={{ borderColor: colourValue }}
      >
        <ContextMenuLabel className='truncate text-base py-3 select-none'>
          {title}
        </ContextMenuLabel>
        <div className='flex flex-col gap-1.5'>
          {actions.map((action, i) => (
            <form key={i} action={action.action}>
              <button
                className='w-full hover:bg-night group rounded py-1.5 text-sm text-start px-2 font-medium flex gap-2 items-center transition-colors'
                style={{ color: colourValue }}
                type='submit'
              >
                {cloneElement(action.icon, { size: 18 })}
                <span className='text-neutral-200'>{action.name}</span>
              </button>
              {(i === 2 || i === actions.length - 1) && (
                <ContextMenuSeparator
                  className='h-[2px] mb-0 mt-1'
                  style={{ backgroundColor: colourValue }}
                />
              )}
            </form>
          ))}
          <div className='text-silver text-xs px-1 select-none'>
            <p>Created by {owner}</p>
            <p>{lastUpdateDate}</p>
          </div>
        </div>
      </ContextMenuContent>
    </ContextMenu>
  );
}
