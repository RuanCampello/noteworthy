import {
  AvatarFallback,
  AvatarImage,
  Avatar as AvatarWrapper,
} from '@/ui/avatar';

interface AvatarProps {
  source: string | null;
  fallback: string;
}

export function Avatar({ source, fallback }: AvatarProps) {
  return (
    <AvatarWrapper>
      <AvatarImage className='object-cover' src={source!} />
      <AvatarFallback className='bg-slate font-semibold'>
        {fallback}
      </AvatarFallback>
    </AvatarWrapper>
  );
}
