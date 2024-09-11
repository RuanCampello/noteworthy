'use client';

import CharacterCount from '@tiptap/extension-character-count';
import FontFamily from '@tiptap/extension-font-family';
import Highlight from '@tiptap/extension-highlight';
import Placeholder from '@tiptap/extension-placeholder';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import { type EditorProps } from '@tiptap/pm/view';
import { EditorProvider, Extension } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import FontSize from 'tiptap-extension-font-size';
import EditorMenuBar from './EditorMenuBar';

import { DoubleClickLink } from '@/utils/double-click-link';
import { ReactNode } from 'react';
import NoteBubbleMenu from './NoteBubbleMenu';

interface NoteEditorProps {
  content: string;
  children: ReactNode;
  isEditable: boolean;
  fullNote: boolean;
}

export default function NoteEditor({
  content,
  children,
  isEditable,
  fullNote,
}: NoteEditorProps) {
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
          'Mod-e': () => {
            return true;
          },
        };
      },
    }),
  ];
  const editorProps: EditorProps = {
    attributes: {
      class: `prose prose-neutral selection:bg-night selection:text-neutral-200 px-2 pb-12 prose-invert prose-p:m-0 prose-p:leading-snug prose-headings:my-1 focus:outline-none scrollbar scroll-smooth scrollbar-thumb-silver scrollbar-track-black placeholder:text-black pt-2 ${fullNote ? 'max-w-[100%]' : 'max-w-[50vw] left-[15vw]'}`,
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
      immediatelyRender={false}
      extensions={extensions}
      editorProps={editorProps}
    >
      <div>
        <NoteBubbleMenu />
      </div>
    </EditorProvider>
  );
}
