'use client';

import { ColourType, Colours, darkenColour } from '@/utils/colours';
import { secondsToLocaleDate } from '@/utils/date';
import { stripHTMLTags } from '@/utils/format';
import { HTMLContent } from '@tiptap/react';
import { setCookie } from 'cookies-next';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface NoteProps {
  uid: string;
  name: string;
  text: HTMLContent;
  colour: ColourType;
  date: number;
  href: 'notes' | 'favourites';
}

export default function Note({
  name,
  text,
  colour,
  date,
  uid,
  href,
}: NoteProps) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentId = pathname.replace(/^\/(?:notes|favourites)\//, '');
  useEffect(() => {
    if (currentId === uid) setFocused(true);
  }, [currentId, uid, focused]);

  function formatRedirectUrl(): string {
    if (pathname.includes('notes')) return uid;
    if (pathname.includes('favourites/') && href === 'favourites') return uid;
    if (pathname.includes('favourites/')) return `/notes/${uid}`;
    else return `${href}/${uid}`;
  }

  const redirectUrl =
    searchParams.size > 0
      ? `${formatRedirectUrl()}?${searchParams}`
      : formatRedirectUrl();

  const backgroundColour = Colours[colour];
  const setOpenNote = (id: string) => setCookie('open_note', uid);
  return (
    <Link
      href={
        //if the user is inside a favourite note and click on a non favourite note
        // remove the favourite from redirect link and transform into a note link
        href === 'favourites' && pathname.includes('favourites/')
          ? redirectUrl.replace('favourites', '')
          : redirectUrl
      }
      onClick={() => setOpenNote(uid)}
      className='rounded-sm lg:p-5 p-2 w-full first:mt-1 last:mb-1 focus:outline-none z-10 select-none'
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
