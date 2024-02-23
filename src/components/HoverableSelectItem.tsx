'use client';

import { useState } from 'react';
import { SelectItem } from './ui/select';
import { Colours } from '@/utils/colours';

interface HoverableSelectItemProps {
  value: string;
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
        textTransform: 'capitalize'
      }}
    >
      {name}
    </SelectItem>
  );
}
