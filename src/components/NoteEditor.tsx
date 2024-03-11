'use client';

import { EditorProvider } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import EditorMenuBar from './EditorMenuBar';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import { ReactNode } from 'react';

interface NoteEditorProps {
  content: string;
  children: ReactNode;
}

export default function NoteEditor({ content, children }: NoteEditorProps) {
  const extensions = [
    StarterKit,
    Underline,
    Highlight,
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
  ];
  const editorProps = {
    attributes: {
      class:
        'prose prose-neutral prose-invert focus:outline-none scrollbar-thin scrollbar-thumb-silver scrollbar-track-black px-4 selection:bg-night selection:text-neutral-200',
    },
  };
  return (
    <>
      <EditorProvider
        content={content}
        slotBefore={
          <>
            {children}
            <EditorMenuBar />
          </>
        }
        extensions={extensions}
        editorProps={editorProps}
      >
        <></>
      </EditorProvider>
    </>
  );
}
