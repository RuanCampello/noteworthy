'use client';

import { ColourType, Colours, lightenColour } from '@/utils/colours';
import Link from 'next/link';
import { useState } from 'react';

interface NoteProps {
  name: string;
  text: string;
  colour: ColourType;
  date: string;
}

export default function Note({ name, text, colour, date }: NoteProps) {
  const [hovered, setHovered] = useState(false);

  const backgroundColour = Colours[colour];
  return (
    <Link
      href='/'
      className='rounded-sm p-5'
      style={{
        transition: 'background-color 0.5s ease',
        background: hovered
          ? lightenColour(backgroundColour, 6)
          : backgroundColour,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <h3 className='text-lg font-semibold truncate text-black'>{name}</h3>
      <div className='flex gap-2.5'>
        <span className='text-black/60'>{date}</span>
        <p className='truncate text-black/80'>{text}</p>
      </div>
    </Link>
  );
}
