'use client';

import { BubbleMenu, useCurrentEditor } from '@tiptap/react';
import { BookA } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function NoteBubbleMenu() {
  const { editor } = useCurrentEditor();
  const [selectedWord, setSelectedWord] = useState(String);
  const searchParams = useSearchParams();
  const router = useRouter();
  const t = useTranslations('Shortcuts');
  const params = new URLSearchParams(searchParams);

  if (!editor) return;

  function handleDefine() {
    params.set('dfn-open', 'true');
    params.set('dfn-word', selectedWord);
    router.push(`?${params}`);
    router.refresh();
  }

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
      <button
        onClick={handleDefine}
        className='flex items-center rounded-md gap-1 p-2 py-1.5 text-sm bg-neutral-100 hover:bg-neutral-200 text-black font-medium focus:outline-none transition-colors'
      >
        <BookA size={18} strokeWidth={1.7} />
        <div>
          {t('dfn')}
          <span className='text-black/80 lowercase'>{` '${selectedWord}'`}</span>
        </div>
      </button>
    </BubbleMenu>
  );
}
