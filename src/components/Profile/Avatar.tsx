'use client';

import { useImageAge } from '@/lib/zustand/image';
import {
  AvatarFallback,
  AvatarImage,
  Avatar as AvatarWrapper,
} from '@/ui/avatar';

interface AvatarProps {
  source: string;
  fallback: string;
}

export function Avatar({ source, fallback }: AvatarProps) {
  const { age } = useImageAge();
  source = `${source}?${age.toISOString()}`;

  return (
    <AvatarWrapper>
      <AvatarImage className='object-cover' src={source} />
      <AvatarFallback className='bg-slate font-semibold'>
        {fallback}
      </AvatarFallback>
    </AvatarWrapper>
  );
}
