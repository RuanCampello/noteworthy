'use client';

/* eslint-disable react-hooks/exhaustive-deps */
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from '@/ui/select';
import { Separator } from '@/ui/separator';
import { useCurrentEditor } from '@tiptap/react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import MenuItems from '../MenuItems';
import SelectFontFamily from '../SelectFontFamily';
import SelectFontSize from '../SelectFontSize';
import MenuTooltip from '../Tooltip';

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export default function EditorMenuBar() {
  const { editor } = useCurrentEditor();
  const t = useTranslations('Format');

  function getDefaultValue() {
    if (!editor || !t || !t('h')) return;
    if (editor.isActive('paragraph')) return t('p');
    for (let i = 1; i <= 4; i++) {
      if (editor?.isActive('heading', { level: i })) return `${t('h')} ${i}`;
    }
  }

  const defaultValue = getDefaultValue();
  const [selectedValue, setSelectedValue] = useState(defaultValue);

  useEffect(() => {
    if (!editor) return;
    function handleEditorChange() {
      if (!editor) return;
      const headingLevels = [1, 2, 3, 4];
      const activeHeadingLevel = headingLevels.find((level) =>
        editor.isActive('heading', { level }),
      );

      if (activeHeadingLevel) {
        setSelectedValue(`${t('h')} ${activeHeadingLevel}`);
      } else if (editor.isActive('paragraph')) {
        setSelectedValue(t('p'));
      }
    }
    editor.on('transaction', handleEditorChange);
    return () => {
      editor.off('transaction', handleEditorChange);
    };
  }, [editor]);

  if (!editor) return null;

  function handleClick(level: HeadingLevel) {
    if (!editor) return;
    editor.chain().focus().toggleHeading({ level: level }).run();
    setSelectedValue(`${t('h')} ${level}`);
  }
  function handleParagraph() {
    if (!editor) return;
    editor.chain().focus().setParagraph().run();
    setSelectedValue(t('p'));
  }
  return (
    <div className='flex flex-col gap-1 xl:px-0 px-4'>
      <div className='flex items-center gap-1'>
        <Select value={selectedValue}>
          <MenuTooltip content={t('style')} sideOffset={6}>
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
                    value={`${t('h')} ${index + 1}`}
                    className={`py-1.5 leading-none px-1 ${
                      editor.isActive('heading', { level: index + 1 })
                        ? 'bg-neutral-100 rounded-sm text-black'
                        : 'text-neutral-200'
                    }`}
                    style={{ fontSize: `${(4 - index + 1) * 8}px` }}
                    onClick={() => handleClick((index + 1) as HeadingLevel)}
                  >
                    {t('h')} {index + 1}
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
                {t('p')}
              </button>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Separator orientation='vertical' />
        <SelectFontFamily />
        <Separator orientation='vertical' />
        <SelectFontSize />
        <Separator orientation='vertical' />
        <MenuItems />
      </div>
      <Separator />
    </div>
  );
}
