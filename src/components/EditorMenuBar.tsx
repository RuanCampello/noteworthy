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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { useState } from 'react';

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export default function EditorMenuBar() {
  const { editor } = useCurrentEditor();
  const defaultValue = getDefaultValue();
  const [selectedValue, setSelectedValue] = useState(defaultValue);
  if (!editor) return null;
  const buttonStyle = 'p-2 rounded-md hover:bg-neutral-100 hover:text-night/80';
  function handleClick(level: HeadingLevel) {
    if (!editor) return;
    editor.chain().focus().toggleHeading({ level: level }).run();
    setSelectedValue(`Heading ${level}`);
  }
  function handleParagraph() {
    if (!editor) return;
    editor.chain().focus().setParagraph().run();
    setSelectedValue('Paragraph');
  }
  function getDefaultValue() {
    if (editor?.isActive('paragraph')) return 'Paragraph';
    for (let i = 1; i <= 4; i++) {
      if (editor?.isActive('heading', { level: i })) return `Heading ${i}`;
    }
  }

  return (
    <div className='flex flex-col gap-[6px]'>
      <Separator className='bg-white/10' />
      <div className='flex items-center gap-1'>
        <Select value={selectedValue}>
          <SelectTrigger className='bg-black border-none w-32'>
            <SelectValue defaultValue={defaultValue}>
              {selectedValue}
            </SelectValue>
          </SelectTrigger>
          <SelectContent sideOffset={4} className='bg-black border-midnight'>
            <SelectGroup>
              <button
                onClick={handleParagraph}
                className={`py-1.5 w-full text-sm px-1 ${
                  editor.isActive('paragraph')
                    ? 'bg-neutral-100 rounded-sm text-black'
                    : 'text-neutral-200'
                }`}
                value='Paragraph'
              >
                Paragraph
              </button>
              <div className='flex flex-col'>
                {Array.from({ length: 4 }, (_, index) => (
                  <button
                    key={`${index}`}
                    value={`Heading ${index + 1}`}
                    className={`py-1.5 text-sm px-1 ${
                      editor.isActive('heading', { level: index + 1 })
                        ? 'bg-neutral-100 rounded-sm text-black'
                        : 'text-neutral-200'
                    }`}
                    onClick={() => handleClick((index + 1) as HeadingLevel)}
                  >
                    Heading {index + 1}
                  </button>
                ))}
              </div>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Separator orientation='vertical' className='bg-white/10' />
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
