'use client';

import { generateSequence } from '@/utils/generate-sequence';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
} from './ui/select';
import { useCurrentEditor } from '@tiptap/react';
import { useEffect, useState } from 'react';
import MenuTooltip from './Tooltip';

export default function SelectFontSize() {
  const { editor } = useCurrentEditor();
  const [fontSize, setFontSize] = useState<Number>(12);
  const fontSizes = generateSequence();

  useEffect(() => {
    if (!editor) return;

    const handleSizeChange = () => {
      const activeSize = fontSizes.find((size) =>
        editor.isActive('textStyle', { fontSize: `${size}pt` })
      );
      if (activeSize) setFontSize(activeSize);
      else setFontSize(12);
    };
    editor.on('transaction', handleSizeChange);
    return () => {
      editor.off('transaction', handleSizeChange);
    };
  }, [editor]);

  function handleFontSize(size: Number) {
    if (!editor) return;
    editor.chain().focus().setFontSize(`${size}pt`).run();
    setFontSize(size);
  }

  if (!editor) return;
  return (
    <Select value={fontSize.toString()}>
      <MenuTooltip content='Font size' sideOffset={6}>
        <SelectTrigger className='w-16 bg-black border-none font-semibold'>
          <SelectValue>{fontSize.toString()}</SelectValue>
        </SelectTrigger>
      </MenuTooltip>
      <SelectContent className='w-16 bg-black dark border-2 border-silver'>
        <SelectGroup className='flex flex-col gap-1 pe-1'>
          {fontSizes.map((size) => (
            <button
              className={`${
                editor.isActive('textStyle', { fontSize: `${size}pt` })
                  ? 'bg-neutral-100 text-black rounded-sm'
                  : ''
              }`}
              onClick={() => handleFontSize(size)}
              key={size}
            >
              {size}
            </button>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
