import { ReactNode, cloneElement } from 'react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '../ui/context-menu';
import { Archive, ArchiveX, Pencil, Star, StarOff, Trash } from 'lucide-react';
import { Colours } from '@/utils/colours';
import { toggleNoteArchive, toggleNoteFavourite } from '@/actions/note';
import { Note } from '@prisma/client';
import { currentUser } from '@/data/note';

interface ExtendedNote extends Note {
  owner: string | null | undefined;
}

interface NoteContextMenuProps {
  children: ReactNode;
  note: ExtendedNote;
}

type Action = {
  name: string;
  action: () => Promise<void>;
  icon: JSX.Element;
  activeIcon?: JSX.Element;
  activeName?: string;
};

export default async function NoteContextMenu({
  children,
  note,
}: NoteContextMenuProps) {
  const user = await currentUser();
  const userId = user?.id;

  const actions: Action[] = [
    {
      name: 'Add to Favourites',
      action: handleFavourite,
      icon: <Star />,
      activeIcon: <StarOff />,
      activeName: 'Unfavourite',
    },
    {
      name: 'Move to Archive',
      action: handleArchive,
      icon: <Archive />,
      activeIcon: <ArchiveX />,
      activeName: 'Unarchive',
    },
    { name: 'Edit', action: handleEdit, icon: <Pencil /> },
    { name: 'Delete', action: handleDelete, icon: <Trash /> },
  ];

  const colourValue = Colours[note.colour];
  const lastUpdateDate = note.lastUpdate.toLocaleDateString('en-GB');

  async function handleFavourite() {
    'use server';
    if (!userId) return;
    await toggleNoteFavourite(note.id, userId);
  }
  async function handleEdit() {
    'use server';
  }
  async function handleArchive() {
    'use server';
    if (!userId) return;
    await toggleNoteArchive(note.id, userId);
  }
  async function handleDelete() {
    'use server';
  }
  return (
    <ContextMenu>
      <ContextMenuTrigger className='flex'>{children}</ContextMenuTrigger>
      <ContextMenuContent
        className='dark bg-black rounded-lg border-2 shadow-md shadow-black/70 w-48'
        style={{ borderColor: colourValue }}
      >
        <ContextMenuLabel className='truncate text-base py-3 select-none'>
          {note.title}
        </ContextMenuLabel>
        <div className='flex flex-col gap-1'>
          {actions.map((action, i) => (
            <form key={i} action={action.action}>
              <button
                className='w-full hover:bg-night group rounded p-2 text-sm text-start font-medium flex gap-2 items-center transition-colors disabled:hidden'
                style={{ color: colourValue }}
                type='submit'
                disabled={
                  (note.isArchived && i === 0) || (note.isFavourite && i === 1)
                }
              >
                {cloneElement(
                  (note.isFavourite && action.activeIcon) ||
                    (note.isArchived && action.activeIcon)
                    ? action.activeIcon
                    : action.icon,
                  { size: 18 }
                )}
                <span className='text-neutral-200'>
                  {(note.isFavourite && action.activeName) ||
                  (note.isArchived && action.activeName)
                    ? action.activeName
                    : action.name}
                </span>
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
            {note.owner && <p>Created by {note.owner}</p>}
            <p>Modified at {lastUpdateDate}</p>
          </div>
        </div>
      </ContextMenuContent>
    </ContextMenu>
  );
}
