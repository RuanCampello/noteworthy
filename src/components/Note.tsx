'use client';

import { ColourType, Colours, darkenColour } from '@/utils/colours';
import { secondsToLocaleDate } from '@/utils/date';
import { stripHTMLTags } from '@/utils/html-to-string';
import { HTMLContent } from '@tiptap/react';
import { setCookie } from 'cookies-next';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

interface NoteProps {
  id: string;
  name: string;
  text: HTMLContent;
  colour: ColourType;
  date: number;
}

export default function Note({ name, text, colour, date, id }: NoteProps) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  const pathname = usePathname().replace('/notes/', '');
  useEffect(() => {
    if (pathname === id) setFocused(true);
  }, [pathname, id, focused]);

  const backgroundColour = Colours[colour];
  const setOpenNote = (id: string) => setCookie('open_note', id);
  return (
    <Link
      href={`/notes/${id}`}
      onClick={() => setOpenNote(id)}
      className='rounded-sm lg:p-5 p-2 first:mt-1 last:mb-1 focus:outline-none z-10 select-none'
      style={{
        transition: 'background-color 0.5s ease',
        background: hovered
          ? darkenColour(backgroundColour, 10)
          : backgroundColour,
        outline: focused ? `${Colours[colour]} solid 2px` : '',
        outlineOffset: focused ? '2px' : '',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      <h3 className='text-lg font-semibold truncate text-black' title={name}>
        {name}
      </h3>
      <div className='flex gap-2.5'>
        <span className='text-black/60 lg:inline-block hidden'>
          {secondsToLocaleDate(date)}
        </span>
        <p className='truncate text-black/80 lg:inline-block hidden'>
          {stripHTMLTags(text)}
        </p>
      </div>
    </Link>
  );
}
