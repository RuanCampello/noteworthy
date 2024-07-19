import { Avatar as AvatarRoot, AvatarFallback, AvatarImage } from '@/ui/avatar';

interface AvatarProps {
  providerImage: string | null | undefined;
  cloudflareImage: string | null;
  name: string;
}

export default function Avatar({
  providerImage,
  cloudflareImage,
  name,
}: AvatarProps) {
  return (
    <AvatarRoot className='dark'>
      <AvatarImage
        className='object-cover'
        src={providerImage || cloudflareImage || ''}
      />
      <AvatarFallback className='bg-slate font-semibold text-neutral-100'>
        {name[0].toUpperCase()}
      </AvatarFallback>
    </AvatarRoot>
  );
}
