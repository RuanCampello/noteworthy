import Image from 'next/image';
import LogoImage from '../../public/assets/logo.svg';

import { Lora } from 'next/font/google';
import Link from 'next/link';
const lora = Lora({ subsets: ['latin'] });

export default function Logo() {
  return (
    <Link
      href='/'
      className='p-2 flex items-center text-xl text-neutral-300 font-semibold group w-fit'
    >
      <Image
        alt='noteworthy'
        className='group-hover:scale-110 transition-transform duration-300'
        src={LogoImage}
        width={42}
        height={42}
      />
      <h1 className={lora.className}>
        Note<span className='text-neutral-100'>worthy</span>
      </h1>
    </Link>
  );
}
