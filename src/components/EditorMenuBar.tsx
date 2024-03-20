import { Separator } from './ui/separator';
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Check,
  Highlighter,
  Italic,
  Strikethrough,
  Subscript,
  Superscript,
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
import { useEffect, useState } from 'react';
import { toast } from './ui/use-toast';
import { saveNote } from '@/utils/api';
import { usePathname } from 'next/navigation';

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export default function EditorMenuBar() {
  const { editor } = useCurrentEditor();
  const defaultValue = getDefaultValue();
  const [selectedValue, setSelectedValue] = useState(defaultValue);
  const pathname = usePathname();

  useEffect(() => {
    async function handleSaveShortcut(event: KeyboardEvent) {
      if (event.ctrlKey && event.altKey && event.key === 's') {
        const currentContent = editor?.getHTML();
        if (!currentContent) return;
        await saveNote(currentContent, pathname);
        toast({
          title: 'Note Saved',
          description:
            "Your note has been saved! It's ready whenever you need it. 📌",
          variant: 'success',
          action: (
            <div className='bg-blue/20 p-2 rounded-md w-fit'>
              <Check
                size={24}
                className='bg-blue text-midnight p-1 rounded-full'
              />
            </div>
          ),
        });
      }
    }
    window.addEventListener('keydown', handleSaveShortcut);
    return () => window.removeEventListener('keydown', handleSaveShortcut);
  }, []);

  if (!editor) return null;
  const buttonStyle =
    'p-2 rounded-md hover:bg-neutral-100 hover:text-night/80 transition-colors duration-150';

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
    if (!editor) return;
    if (editor.isActive('paragraph')) return 'Paragraph';
    for (let i = 1; i <= 4; i++) {
      if (editor?.isActive('heading', { level: i })) return `Heading ${i}`;
    }
  }
  function handleSuperscript() {
    if (!editor) return;
    if (editor.isActive('subscript')) {
      editor.chain().focus().unsetSubscript().run();
      editor.chain().focus().toggleSuperscript().run();
    } else {
      editor.chain().focus().toggleSuperscript().run();
    }
  }
  function handleSubscript() {
    if (!editor) return;
    if (editor.isActive('superscript')) {
      editor.chain().focus().unsetSuperscript().run();
      editor.chain().focus().toggleSubscript().run();
    } else {
      editor.chain().focus().toggleSubscript().run();
    }
  }
  return (
    <div className='flex flex-col gap-[6px] px-14'>
      <Separator className='bg-white/10' />
      <div className='flex items-center gap-1'>
        <Select value={selectedValue}>
          <SelectTrigger className='bg-black border-none w-32'>
            <SelectValue>{selectedValue}</SelectValue>
          </SelectTrigger>
          <SelectContent
            sideOffset={6}
            className='bg-black border-midnight p-1'
          >
            <SelectGroup>
              <div className='flex flex-col'>
                {Array.from({ length: 4 }, (_, index) => (
                  <button
                    key={`${index}`}
                    value={`Heading ${index + 1}`}
                    className={`py-1.5 leading-none px-1 ${
                      editor.isActive('heading', { level: index + 1 })
                        ? 'bg-neutral-100 rounded-sm text-black'
                        : 'text-neutral-200'
                    }`}
                    style={{ fontSize: `${(4 - index + 1) * 12}px` }}
                    onClick={() => handleClick((index + 1) as HeadingLevel)}
                  >
                    Heading {index + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={handleParagraph}
                className={`py-1.5 w-full text-base px-1 ${
                  editor.isActive('paragraph')
                    ? 'bg-neutral-100 rounded-sm text-black'
                    : 'text-neutral-200'
                }`}
                value='Paragraph'
              >
                Paragraph
              </button>
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
        <MenuTooltip content='Strike (Ctrl+Shift+S)'>
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
        <Separator className='bg-white/10' orientation='vertical' />
        <MenuTooltip content='Superscript'>
          <button
            className={`${buttonStyle} ${
              editor.isActive('superscript') ? 'bg-neutral-100 text-black' : ''
            }`}
            onClick={handleSuperscript}
          >
            <Superscript size={20} />
          </button>
        </MenuTooltip>
        <MenuTooltip content='Subscript'>
          <button
            className={`${buttonStyle} ${
              editor.isActive('subscript') ? 'bg-neutral-100 text-black' : ''
            }`}
            onClick={handleSubscript}
          >
            <Subscript size={20} />
          </button>
        </MenuTooltip>
      </div>
      <Separator className='bg-white/10' />
    </div>
  );
}
