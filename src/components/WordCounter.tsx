'use client';

import { useCurrentEditor } from '@tiptap/react';
import { WholeWord } from 'lucide-react';

export default function WordCounter() {
  const { editor } = useCurrentEditor();
  if (!editor) return;

  const words = editor.storage.characterCount.words();
  return (
    <div className='flex gap-2 items-center'>
      <WholeWord size={22} strokeWidth={2} />
      <span className='mr-6'>Words</span>
      <span className='text-neutral-100'>{words}</span>
    </div>
  );
}
