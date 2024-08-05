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
import { getTranslations } from 'next-intl/server';

type Shortcut = {
  action: string;
  commands: string[];
};

export default async function KeyboardDialog() {
  const tk = await getTranslations('Keyboard');
  const t = await getTranslations('Shortcuts');

  const shortcuts: Shortcut[] = [
    {
      action: t('alg_l'),
      commands: ['Ctrl', 'Shift', 'L'],
    },
    {
      action: t('alg_c'),
      commands: ['Ctrl', 'Shift', 'E'],
    },
    {
      action: t('alg_r'),
      commands: ['Ctrl', 'Shift', 'R'],
    },
    {
      action: t('justify'),
      commands: ['Ctrl', 'Shift', 'J'],
    },
    {
      action: t('bold'),
      commands: ['Ctrl', 'B'],
    },
    {
      action: t('italic'),
      commands: ['Ctrl', 'I'],
    },
    {
      action: t('underline'),
      commands: ['Ctrl', 'U'],
    },
    {
      action: t('strike'),
      commands: ['Ctrl', 'Shift', 'S'],
    },
    {
      action: t('highlight'),
      commands: ['Ctrl', 'Shift', 'H'],
    },
  ];

  const noteShortcuts: Shortcut[] = [
    { action: t('save_note'), commands: ['Ctrl', 'S'] },
    { action: t('create_note'), commands: ['Ctrl', 'E'] },
  ];

  const globalShortcuts: Shortcut[] = [
    { action: t('toggle_sidebar'), commands: ['Shift', 'Alt', 'S'] },
    { action: t('search'), commands: ['Ctrl', 'K'] },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size='xs' variant='dropdown'>
          {tk('title')}
          <DropdownMenuShortcut>
            <Keyboard size={16} className='shrink-0' />
          </DropdownMenuShortcut>
        </Button>
      </DialogTrigger>
      <DialogContent className='dark bg-black max-w-[564px]'>
        <DialogHeader>
          <DialogTitle>{tk('title')}</DialogTitle>
          <DialogDescription>{tk('description')}</DialogDescription>
        </DialogHeader>
        <section className='grid grid-cols-2 mt-4 gap-4'>
          <div className='grid grid-rows-2'>
            <div>
              <Title>{tk('note')}</Title>
              <Separator className='my-1.5' />
              <div className='flex flex-col gap-1'>
                {noteShortcuts.map((shortcut) => (
                  <ShortcutItem key={shortcut.action} {...shortcut} />
                ))}
              </div>
            </div>
            <div>
              <Title>{tk('global')}</Title>
              <Separator className='my-1.5' />
              <div className='flex flex-col gap-1'>
                {globalShortcuts.map((shortcut) => (
                  <ShortcutItem key={shortcut.action} {...shortcut} />
                ))}
              </div>
            </div>
          </div>
          <div>
            <Title>{tk('editor')}</Title>
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
      <p className='font-semibold text-[13px]'>{action}</p>
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
