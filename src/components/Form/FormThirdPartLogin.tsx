import Image from 'next/image';
import { StaticImageData } from 'next/image';

interface FormThirdPartLoginProps {
  image: StaticImageData | string;
  name: string;
  type: 'signup' | 'login';
}

export default function FormThirdPartLogin({
  image,
  name,
  type,
}: FormThirdPartLoginProps) {
  return (
    <div className='mt-12 mb-10'>
      <button
        type='button'
        className='bg-neutral-200 hover:bg-neutral-300 transition-colors duration-200 font-semibold text-midnight p-3 w-full rounded-md flex items-center justify-center gap-4'
      >
        <Image width={32} height={32} src={image} alt={`${name}'s logo`} />
        {type === 'login' ? (
          <span>Login with {name}</span>
        ) : (
          <span>Sign up with {name}</span>
        )}
      </button>
    </div>
  );
}
