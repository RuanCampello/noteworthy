import { DEFAULT_REDIRECT } from '@/routes';
import { signIn } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import Image, { StaticImageData } from 'next/image';

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
  const t = useTranslations('Login');

  async function handleLogin() {
    await signIn(name.toLowerCase(), {
      redirectTo: DEFAULT_REDIRECT,
    });
  }

  return (
    <button
      onClick={handleLogin}
      type='button'
      disabled={disableWhen || process.env.NODE_ENV !== 'production'}
      className='bg-midnight hover:bg-night/80 disabled:bg-night/60 disabled:text-neutral-400 disabled:grayscale transition-colors duration-300 font-medium border-night border text-neutral-100 py-2.5 w-full rounded-lg flex items-center justify-center gap-2.5 mt-2.5'
    >
      <Image width={24} height={24} src={image} alt={`${name}'s logo`} />
      {type === 'login' ? (
        <span>
          {t('login_with')} {name}
        </span>
      ) : (
        <span>
          {t('sign_with')} {name}
        </span>
      )}
    </button>
  );
}
