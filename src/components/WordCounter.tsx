'use client';

import { useCurrentEditor } from '@tiptap/react';
import { WholeWord } from 'lucide-react';
import NoteHeaderItem from './Note/NoteHeaderItem';
import { useTranslations } from 'next-intl';

export default function WordCounter() {
  const { editor } = useCurrentEditor();
  const t = useTranslations('Header');
  if (!editor) return;

  const words = editor.storage.characterCount.words();
  return (
    <NoteHeaderItem name={t('words')} value={words}>
      <WholeWord size={22} strokeWidth={2} />
    </NoteHeaderItem>
  );
}
