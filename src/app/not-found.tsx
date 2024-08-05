import Image from 'next/image';
import Logo from '@/assets/logo.svg';

export default function NotFound() {
  return (
    <div className='h-screen w-screen flex flex-col gap-8 items-center justify-center text-neutral-200 bg-black'>
      <div className={`flex gap-3 items-center text-9xl`}>
        <span>4</span>
        <div className='bg-neutral-200 rounded-full flex items-center p-4 mt-4'>
          <Image
            src={Logo}
            width={68}
            height={68}
            alt='Logo'
            className='brightness-0 saturate-100 invert-[10%] sepia-[18%] hue-rotate-[314deg] contrast-100'
          />
        </div>
        <span>4</span>
      </div>
    </div>
  );
}
