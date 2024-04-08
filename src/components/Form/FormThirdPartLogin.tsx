import Image from 'next/image';
import { StaticImageData } from 'next/image';

interface FormThirdPartLoginProps {
  image: StaticImageData | string;
  name: string;
  type: 'signup' | 'login';
  disableWhen: boolean;
}

export default function FormThirdPartLogin({
  image,
  name,
  type,
  disableWhen,
}: FormThirdPartLoginProps) {
  return (
    <button
      type='button'
      disabled={disableWhen}
      className='bg-neutral-200 hover:bg-neutral-300 disabled:bg-neutral-300 transition-colors duration-200 font-semibold text-midnight py-2 w-full rounded-md flex items-center justify-center gap-4 mt-3'
    >
      <Image width={24} height={24} src={image} alt={`${name}'s logo`} />
      {type === 'login' ? (
        <span>Login with {name}</span>
      ) : (
        <span>Sign up with {name}</span>
      )}
    </button>
  );
}
