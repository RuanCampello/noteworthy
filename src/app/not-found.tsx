import Image from 'next/image';
import Logo from '../../public/assets/logo.svg';
import { Dela_Gothic_One } from 'next/font/google';
import { headers } from 'next/headers';
import Link from 'next/link';

const gothicOne = Dela_Gothic_One({
  weight: '400',
  style: 'normal',
  subsets: ['latin'],
});

export default function NotFound() {
  const pathname = headers().get('pathname');
  //todo
  // const { href, text, redirectTitle } = getNavigationInfo(pathname || '');
  return (
    <div className='h-screen w-screen flex flex-col gap-8 items-center justify-center text-neutral-200 bg-black'>
      <div className={`flex gap-3 items-center text-9xl ${gothicOne.className}`}>
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
      {/* <div className='text-center flex flex-col gap-3'>
        <h1 className='text-4xl font-semibold uppercase'>Page not found</h1>
        <p className='text-silver'>
          Uh oh, it seems like the {text} you are looking for does not exist
        </p>
        <Link
          href={href}
          className='mt-12 border-2 rounded-lg font-semibold border-silver px-6 py-2 w-fit self-center hover:bg-silver hover:text-black transition-colors duration-200 focus:outline-none'
        >
          Return to {redirectTitle}
        </Link>
      </div> */}
    </div>
  );
}
