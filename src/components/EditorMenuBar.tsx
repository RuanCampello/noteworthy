/* eslint-disable react-hooks/exhaustive-deps */
import { Separator } from './ui/separator';
import { Check } from 'lucide-react';
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
import { usePathname, useRouter } from 'next/navigation';
import MenuItems from './MenuItems';

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

const fontFamilies = [
  { name: 'Garamond', value: 'Cormorant Garamond' },
  { name: 'Montserrat', value: 'Montserrat' },
  { name: 'Lobster', value: 'Lobster' },
  { name: 'Didot', value: 'GFS Didot' },
  { name: 'Merriweather', value: 'Merriweather' },
];

export default function EditorMenuBar() {
  const { editor } = useCurrentEditor();
  const defaultValue = getDefaultValue();
  const [selectedValue, setSelectedValue] = useState(defaultValue);
  const [fontFamily, setFontFamily] = useState({
    name: 'Source Sans 3',
    value: 'Source Sans 3',
  });
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    async function handleSaveShortcut(event: KeyboardEvent) {
      if (event.ctrlKey && event.altKey && event.key === 's') {
        const currentContent = editor?.getHTML();
        if (!currentContent) return;
        await saveNote(currentContent, pathname);
        router.refresh();
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

  useEffect(() => {
    if (!editor) return;

    const handleEditorChange = () => {
      const headingLevels = [1, 2, 3, 4];
      const activeHeadingLevel = headingLevels.find((level) =>
        editor.isActive('heading', { level })
      );

      if (activeHeadingLevel) {
        setSelectedValue(`Heading ${activeHeadingLevel}`);
      } else if (editor.isActive('paragraph')) {
        setSelectedValue('Paragraph');
      }
    };
    editor.on('transaction', handleEditorChange);
    return () => {
      editor.off('transaction', handleEditorChange);
    };
  }, [editor]);

  useEffect(() => {
    if (!editor) return;

    const handleFontChange = () => {
      const activeFont = fontFamilies.find((fontFamily) =>
        editor.isActive('textStyle', { fontFamily: fontFamily.value })
      );
      if (activeFont) setFontFamily(activeFont);
      else setFontFamily({ name: 'Source Sans 3', value: 'Source Sans 3' });
    };
    editor.on('transaction', handleFontChange);
    return () => {
      editor.off('transaction', handleFontChange);
    };
  }, [editor]);

  if (!editor) return null;
  
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
  return (
    <div className='flex flex-col gap-1 xl:px-11 px-4'>
      <Separator />
      <div className='flex items-center gap-1'>
        <Select value={selectedValue}>
          <MenuTooltip content='Styles' sideOffset={6}>
            <SelectTrigger className='bg-black border-none w-28 font-semibold'>
              <SelectValue>{selectedValue}</SelectValue>
            </SelectTrigger>
          </MenuTooltip>
          <SelectContent
            sideOffset={6}
            className='bg-black border-silver border-2 p-1'
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
                    style={{ fontSize: `${(4 - index + 1) * 8}px` }}
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
        <Separator orientation='vertical' />
        <Select value={fontFamily.name}>
          <MenuTooltip content='Font Family' sideOffset={6}>
            <SelectTrigger className='bg-black border-none w-[8.5rem] font-semibold'>
              <SelectValue>{fontFamily.name}</SelectValue>
            </SelectTrigger>
          </MenuTooltip>
          <SelectContent
            sideOffset={6}
            className='bg-black border-2 border-silver dark'
          >
            <SelectGroup className='flex flex-col gap-1'>
              <button
                onClick={() => editor.chain().focus().unsetFontFamily().run()}
                className={`py-1.5 leading-none text-start px-1 ${
                  fontFamily.name === 'Source Sans 3'
                    ? 'bg-neutral-100 text-black rounded-sm'
                    : ''
                }`}
              >
                Source Sans 3
              </button>
              {fontFamilies.map((fFamily) => (
                <button
                  onClick={() =>
                    editor.chain().focus().setFontFamily(fFamily.value).run()
                  }
                  className={`py-1.5 leading-none text-start px-1 ${
                    fontFamily.value !== 'Source Sans 3' &&
                    editor.isActive('textStyle', {
                      fontFamily: fFamily.value,
                    })
                      ? 'bg-neutral-100 text-black rounded-sm'
                      : ''
                  }`}
                  key={fFamily.name}
                  style={{ fontFamily: fFamily.value }}
                >
                  {fFamily.name}
                </button>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Separator orientation='vertical' />
        <MenuItems />
      </div>
      <Separator />
    </div>
  );
}
