import Image from 'next/image';
import LogoImage from '@/assets/logo.svg';

import { Lora } from 'next/font/google';
import { redirect } from 'next/navigation';
const lora = Lora({ subsets: ['latin'] });

export default function Logo() {
  async function redirectToHome() {
    'use server';

    redirect('/');
  }
  return (
    <form action={redirectToHome}>
      <button
        type='submit'
        className='p-2 px-5 flex items-center sm:justify-start justify-center md:text-xl text-neutral-300 font-semibold group w-full focus:outline-none'
      >
        <Image
          alt='noteworthy'
          className='group-hover:-translate-x-1 shrink-0 group-hover:rotate-12 transition-transform duration-300'
          src={LogoImage}
          width={42}
          height={42}
        />
        <h1 className={`sm:inline hidden ${lora.className}`}>
          Note<span className='text-neutral-100'>worthy</span>
        </h1>
      </button>
    </form>
  );
}
