import { useTranslations } from 'next-intl';
import { Separator } from '@/ui/separator';

export default function FormSeparator() {
  const t = useTranslations('Login');

  return (
    <div className='flex items-center justify-between text-silver/40 mb-6 mt-9'>
      <Separator className='w-[45%] bg-night' />
      <span className='font-medium select-none uppercase'>{t('or')}</span>
      <Separator className='w-[45%] bg-night' />
    </div>
  );
}
