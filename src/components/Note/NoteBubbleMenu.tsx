'use client';

import { useState } from 'react';
import { BubbleMenu, useCurrentEditor } from '@tiptap/react';
import { BookA } from 'lucide-react';

export default function NoteBubbleMenu() {
  const { editor } = useCurrentEditor();
  const [selectedWord, setSelectedWord] = useState(String);
  if (!editor) return;

  return (
    <BubbleMenu
      shouldShow={({ state, from, to }) => {
        const { doc } = state;
        const selectionText = doc.textBetween(from, to, ' ');
        const isSingleWord = /^\w+$/.test(selectionText);
        setSelectedWord(selectionText);
        return isSingleWord;
      }}
      editor={editor}
    >
      <button className='flex items-center rounded-md gap-1 p-1 text-sm bg-neutral-100 hover:bg-neutral-200 text-black font-medium focus:outline-none transition-colors'>
        <BookA
          size={18}
          strokeWidth={1.7}
        />
        <div>
          Define{' '}
          <span className='text-black/80 lowercase'>{`'${selectedWord}'`}</span>
        </div>
      </button>
    </BubbleMenu>
  );
}
