import { Separator } from './ui/separator';
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Highlighter,
  Italic,
  Strikethrough,
  Underline,
} from 'lucide-react';
import { useCurrentEditor } from '@tiptap/react';
import MenuTooltip from './Tooltip';

export default function EditorMenuBar() {
  const { editor } = useCurrentEditor();
  if (!editor) return null;
  const buttonStyle = 'p-2 rounded-md hover:bg-neutral-100 hover:text-night/80';
  return (
    <div className='flex flex-col gap-[6px]'>
      <Separator className='bg-white/10' />
      <div className='flex items-center gap-1'>
        <MenuTooltip content='Align left (Ctrl+Shift+L)'>
          <button
            className={`${buttonStyle} ${
              editor.isActive({ textAlign: 'left' })
                ? 'bg-neutral-100 text-black'
                : ''
            }`}
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
          >
            <AlignLeft size={20} />
          </button>
        </MenuTooltip>
        <MenuTooltip content='Align center (Ctrl+Shift+E)'>
          <button
            className={`${buttonStyle} ${
              editor.isActive({ textAlign: 'center' })
                ? 'bg-neutral-100 text-black'
                : ''
            }`}
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
          >
            <AlignCenter size={20} />
          </button>
        </MenuTooltip>
        <MenuTooltip content='Align right (Ctrl+Shift+R)'>
          <button
            className={`${buttonStyle} ${
              editor.isActive({ textAlign: 'right' })
                ? 'bg-neutral-100 text-black'
                : ''
            }`}
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
          >
            <AlignRight size={20} />
          </button>
        </MenuTooltip>
        <MenuTooltip content='Justify (Ctrl+Shift+J)'>
          <button
            className={`${buttonStyle} ${
              editor.isActive({ textAlign: 'justify' })
                ? 'bg-neutral-100 text-black'
                : ''
            }`}
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          >
            <AlignJustify size={20} />
          </button>
        </MenuTooltip>
        <Separator className='bg-white/10 h-9' orientation='vertical' />
        <MenuTooltip content='Bold (Ctrl+B)'>
          <button
            className={`${buttonStyle} ${
              editor.isActive('bold') ? 'bg-neutral-100 text-black' : ''
            }`}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <Bold size={20} />
          </button>
        </MenuTooltip>
        <MenuTooltip content='Italic (Ctrl+I)'>
          <button
            className={`${buttonStyle} ${
              editor.isActive('italic') ? 'bg-neutral-100 text-black' : ''
            }`}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <Italic size={20} />
          </button>
        </MenuTooltip>
        <MenuTooltip content='Underline (Ctrl+U)'>
          <button
            className={`${buttonStyle} ${
              editor.isActive('underline') ? 'bg-neutral-100 text-black' : ''
            }`}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          >
            <Underline size={20} />
          </button>
        </MenuTooltip>
        <MenuTooltip content='Strike'>
          <button
            className={`${buttonStyle} ${
              editor.isActive('strike') ? 'bg-neutral-100 text-black' : ''
            }`}
            onClick={() => editor.chain().focus().toggleStrike().run()}
          >
            <Strikethrough size={20} />
          </button>
        </MenuTooltip>
        <MenuTooltip content='Highlight (Ctrl+Shift+H)'>
          <button
            className={`${buttonStyle} ${
              editor.isActive('highlight') ? 'bg-neutral-100 text-black' : ''
            }`}
            onClick={() => editor.chain().focus().toggleHighlight().run()}
          >
            <Highlighter size={20} />
          </button>
        </MenuTooltip>
      </div>
      <Separator className='bg-white/10' />
    </div>
  );
}
