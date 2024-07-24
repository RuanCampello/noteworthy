'use client';

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
} from '@/ui/select';
import { useState, useEffect } from 'react';
import MenuTooltip from './Tooltip';
import { useCurrentEditor } from '@tiptap/react';
import { useTranslations } from 'next-intl';

type FontFamily = { name: string; value: string };

export default function SelectFontFamily() {
  const { editor } = useCurrentEditor();
  const t = useTranslations('Format');
  const [fontFamily, setFontFamily] = useState<FontFamily>({
    name: 'Source Sans 3',
    value: 'Source Sans 3',
  });

  const fontFamilies: FontFamily[] = [
    { name: 'Garamond', value: 'Cormorant Garamond' },
    { name: 'Montserrat', value: 'Montserrat' },
    { name: 'Lobster', value: 'Lobster' },
    { name: 'Didot', value: 'GFS Didot' },
    { name: 'Merriweather', value: 'Merriweather' },
  ];

  useEffect(() => {
    if (!editor) return;

    function handleFontChange() {
      if (!editor) return;
      const activeFont = fontFamilies.find((fontFamily) =>
        editor.isActive('textStyle', { fontFamily: fontFamily.value }),
      );
      if (activeFont) setFontFamily(activeFont);
      else setFontFamily({ name: 'Source Sans 3', value: 'Source Sans 3' });
    }
    editor.on('transaction', handleFontChange);
    return () => {
      editor.off('transaction', handleFontChange);
    };
  }, [editor]);

  if (!editor) return;
  return (
    <Select value={fontFamily.name}>
      <MenuTooltip content={t('font_f')} sideOffset={6}>
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
  );
}
