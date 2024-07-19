import { Button } from '@/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/ui/dialog';
import { Keyboard } from 'lucide-react';
import { DropdownMenuShortcut } from '@/ui/dropdown-menu';
import { Separator } from '@/ui/separator';
import { type ReactNode } from 'react';
import {
  type Shortcut,
  globalShortcuts,
  noteShortcuts,
  shortcuts,
} from '@/utils/constants/shortcuts';

export default function KeyboardDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size='xs' variant='dropdown'>
          Keyboard Shortcuts
          <DropdownMenuShortcut>
            <Keyboard size={16} className='shrink-0' />
          </DropdownMenuShortcut>
        </Button>
      </DialogTrigger>
      <DialogContent className='dark bg-black w-[524px]'>
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
          <DialogDescription>
            Learn essential key combinations to navigate and optimize your
            experience.
          </DialogDescription>
        </DialogHeader>
        <section className='grid grid-cols-2 mt-4 gap-4'>
          <div className='grid grid-rows-2'>
            <div>
              <Title>Note</Title>
              <Separator className='my-1.5' />
              <div className='flex flex-col gap-1'>
                {noteShortcuts.map((shortcut) => (
                  <ShortcutItem key={shortcut.action} {...shortcut} />
                ))}
              </div>
            </div>
            <div>
              <Title>Global</Title>
              <Separator className='my-1.5' />
              <div className='flex flex-col gap-1'>
                {globalShortcuts.map((shortcut) => (
                  <ShortcutItem key={shortcut.action} {...shortcut} />
                ))}
              </div>
            </div>
          </div>
          <div>
            <Title>Editor</Title>
            <Separator className='my-1.5' />
            <div className='flex flex-col gap-1'>
              {shortcuts.map((shortcut) => (
                <ShortcutItem key={shortcut.action} {...shortcut} />
              ))}
            </div>
          </div>
        </section>
      </DialogContent>
    </Dialog>
  );
}

function ShortcutItem({ action, commands }: Shortcut) {
  return (
    <div className='flex justify-between items-center text-sm'>
      <p className='font-semibold'>{action}</p>
      <div className='flex gap-1 bg-neutral-800/40 rounded-md p-1'>
        {commands.map((command) => (
          <div
            key={command}
            className='bg-neutral-800 px-1.5 h-fit font-medium rounded-sm select-none'
          >
            {command}
          </div>
        ))}
      </div>
    </div>
  );
}

function Title({ children }: { children: ReactNode }) {
  return <h2 className='text-lg font-medium text-silver'>{children}</h2>;
}
