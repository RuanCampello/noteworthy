'use client';

import { EditorProvider } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import EditorMenuBar from './EditorMenuBar';
import Strike from '@tiptap/extension-strike';
import Underline from '@tiptap/extension-underline'

export default function NoteEditor() {
  const extensions = [StarterKit, Strike, Underline];
  const editorProps = {
    attributes: {
      class:
        'prose prose-neutral prose-invert focus:outline-none overflow-y-scroll',
    },
  };

  const content = `
  <h1>Hi</h1>
  <h2>there</h2>
<p>
  this is a basic <em>basic</em> example of <b>tiptap</b>. Sure, there are all kind of basic text styles you’d probably expect from a text editor. But wait until you see the lists
  Sure, there are all kind of basic text styles you’d probably expect from a text editor. But wait until you see the listsSure, there are all kind of basic text styles you’d probably expect from a text editor. But wait until you see the listsSure, are all kind of basic text styles you’d probably expect from a text editor. But wait until you see the lists:
</p>
<strike>there</strike>
<ul>
  <li>
    That’s a bullet list with one …
  </li>
  <li>
    … or two list items.
  </li>
</ul>
<p>
  Isn’t that great? And all of that is editable. But wait, there’s more. Let’s try a code block:
</p>
<p>
  I know, I know, this is impressive. It’s only the tip of the iceberg though. Give it a try and click a little bit around. Don’t forget to check the other examples too.
</p>
<blockquote>
  Wow, that’s amazing. Good work, boy! 👏
  <br />
  — Mom
</blockquote>`;
  return (
    <EditorProvider
      content={content}
      slotBefore={<EditorMenuBar />}
      extensions={extensions}
      editorProps={editorProps}
    >
      <></>
    </EditorProvider>
  );
}
