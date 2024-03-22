'use client';

import { useCurrentEditor } from '@tiptap/react';
import { WholeWord } from 'lucide-react';
import NoteHeaderItem from './NoteHeaderItem';

export default function WordCounter() {
  const { editor } = useCurrentEditor();
  if (!editor) return;

  const words = editor.storage.characterCount.words();
  return (
    <NoteHeaderItem name='Words' value={words}>
      <WholeWord size={22} strokeWidth={2} />
    </NoteHeaderItem>
  );
}
