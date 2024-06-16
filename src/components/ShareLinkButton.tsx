'use client';

import { Copy } from 'lucide-react';
import { ScrollArea, ScrollBar } from '@/ui/scroll-area';
import { Button } from '@/ui/button';

export default function ShareLinkButton({ noteId }: { noteId: string }) {
  const hostname =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : process.env.NEXT_PUBLIC_HOSTNAME;

  const shareLink = `${hostname}/notes/${noteId}`;

  async function handleCopy() {
    await navigator.clipboard.writeText(shareLink);
  }

  return (
    <div className='flex flex-col gap-1 mt-6'>
      <h2 className='font-semibold'>URL</h2>
      <div className='flex gap-2 items-center'>
        <ScrollArea className='p-2 whitespace-nowrap border border-secondary rounded-md select-text'>
          {shareLink}
          <ScrollBar orientation='horizontal' />
        </ScrollArea>
        <Button
          onClick={handleCopy}
          className='shrink-0'
          type='button'
          size='icon'
        >
          <Copy size={20} />
        </Button>
      </div>
    </div>
  );
}
