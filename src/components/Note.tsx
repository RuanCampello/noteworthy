'use client';

import { ColourType, Colours, darkenColour } from '@/utils/colours';
import { stripHTMLTags } from '@/utils/format';
import { HTMLContent } from '@tiptap/react';
import { setCookie } from 'cookies-next';
import Link from 'next/link';
import { useParams, usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface NoteProps {
  uid: string;
  name: string;
  text: HTMLContent;
  colour: ColourType;
  date: Date;
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
  const [isMobile, setIsMobile] = useState(false);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>(
    'portrait'
  );

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      setIsMobile(screenWidth <= 768);
      const mqPortrait = window.matchMedia('(orientation: portrait)');
      if (mqPortrait.matches) setOrientation('portrait');
      else setOrientation('landscape');
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentId = useParams<{ id: string }>().id;
  //todo: fix double focus on save
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
  const setOpenNote = (id: string) => setCookie('open_note', id);

  const formattedName: string =
    isMobile && orientation === 'portrait' ? name[0].toUpperCase() : name;
  const textWithoutHtml = stripHTMLTags(text);
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
      className='rounded-sm md:p-3 lg:p-5 p-2 w-full first:mt-1 focus:outline-none z-10 select-none'
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
      <h3 className='lg:text-lg text-base font-semibold truncate text-black sm:text-start text-center'>
        {formattedName}
      </h3>
      <div className='flex gap-2.5 lg:text-base text-sm'>
        <span className='text-black/60 md:inline-block hidden'>
          {date.toLocaleDateString('en-GB')}
        </span>
        <p className='truncate text-black/80 md:inline-block hidden'>
          {textWithoutHtml}
        </p>
      </div>
    </Link>
  );
}
