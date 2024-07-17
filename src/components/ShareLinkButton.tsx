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
    <div className='mt-6'>
      <div className='flex gap-2 items-center h-9'>
        <ScrollArea className='p-1.5 py-2 text-sm text-silver whitespace-nowrap border border-secondary rounded-md select-text'>
          {shareLink}
          <ScrollBar orientation='horizontal' />
        </ScrollArea>
        <Button
          onClick={handleCopy}
          className='shrink-0 me-1 h-9 w-9'
          type='button'
          size='icon'
        >
          <Copy size={18} strokeWidth={2} />
        </Button>
      </div>
    </div>
  );
}
