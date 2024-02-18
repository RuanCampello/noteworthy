import Link from 'next/link';
import SectionTitle from './SectionTitle';
import { Archive, Star } from 'lucide-react';

export default function More() {
  return (
    <div>
      <SectionTitle title='More' />
      <div className='font-semibold flex flex-col'>
        <Link href='/favourites' className='py-2.5 px-5 hover:bg-midnight w-full flex gap-4'>
          <Star size={24} />
          Favourites
        </Link>
        <Link href='/archived' className='py-2.5 px-5 hover:bg-midnight w-full flex gap-4'>
          <Archive size={24} />
          Archived Notes
        </Link>
      </div>
    </div>
  );
}
