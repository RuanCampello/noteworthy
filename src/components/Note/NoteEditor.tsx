'use client';

import { EditorProvider, Extension } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import EditorMenuBar from '../EditorMenuBar';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import Superscript from '@tiptap/extension-superscript';
import Subscript from '@tiptap/extension-subscript';
import TextStyle from '@tiptap/extension-text-style';
import FontFamily from '@tiptap/extension-font-family';
import CharacterCount from '@tiptap/extension-character-count';
import FontSize from 'tiptap-extension-font-size';

import { ReactNode } from 'react';
import { DoubleClickLink } from '@/utils/double-click-link';
import { useSession } from 'next-auth/react';
import NoteBubbleMenu from './NoteBubbleMenu';

interface NoteEditorProps {
  content: string;
  children: ReactNode;
  owner: string | null;
}

export default function NoteEditor({
  content,
  children,
  owner,
}: NoteEditorProps) {
  const { data: session } = useSession();
  if (!session?.user) return;
  const isEditable = session.user.id === owner;

  const extensions = [
    StarterKit,
    Underline,
    Highlight,
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
    Placeholder.configure({
      placeholder: 'Start typing your thoughts here...',
      emptyNodeClass:
        'first:before:content-[attr(data-placeholder)] first:before:text-silver first:before:float-left first:before:pointer-events-none first:before:h-0',
    }),
    Superscript,
    Subscript,
    TextStyle,
    FontFamily,
    FontSize,
    CharacterCount,
    DoubleClickLink,
    Extension.create({
      addKeyboardShortcuts() {
        return {
          Tab: () =>
            this.editor
              .chain()
              .command(({ tr }) => {
                tr.insertText('\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0');
                return true;
              })
              .run(),
        };
      },
    }),
  ];
  const editorProps = {
    attributes: {
      class:
        'prose prose-neutral selection:bg-night selection:text-neutral-200 px-14 pb-12 prose-invert prose-p:m-0 prose-p:leading-snug prose-headings:my-1 focus:outline-none scrollbar-thin scrollbar-thumb-silver scrollbar-track-black placeholder:text-black pt-2',
    },
  };
  return (
    <EditorProvider
      editable={isEditable}
      content={content}
      slotBefore={
        <>
          {children}
          {isEditable && <EditorMenuBar />}
        </>
      }
      extensions={extensions}
      editorProps={editorProps}
    >
      <div>
        <NoteBubbleMenu />
      </div>
    </EditorProvider>
  );
}
