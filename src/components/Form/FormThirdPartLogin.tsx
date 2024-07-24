import { DEFAULT_REDIRECT } from '@/routes';
import { signIn } from 'next-auth/react';
import { useTranslations } from 'next-intl';
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
      disabled={disableWhen}
      className='bg-neutral-200 hover:bg-neutral-300 disabled:bg-neutral-300 transition-colors duration-200 font-semibold text-midnight py-2 w-full rounded-md flex items-center justify-center gap-4 mt-2.5'
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
