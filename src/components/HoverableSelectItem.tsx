'use client';

import type { Colour } from '@/types/database-types';
import { Colours } from '@/utils/colours';
import { useState } from 'react';
import { SelectItem } from './ui/select';

interface HoverableSelectItemProps {
  value: Colour;
  name: string;
}

export default function HoverableSelectItem({
  value,
  name,
}: HoverableSelectItemProps) {
  const [hovered, setHovered] = useState(false);
  return (
    <SelectItem
      value={value}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: Colours[value],
        opacity: hovered ? '80%' : '100%',
        textTransform: 'capitalize',
      }}
    >
      {name}
    </SelectItem>
  );
}
