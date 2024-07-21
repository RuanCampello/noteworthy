import { useTranslations } from 'next-intl';
import { Separator } from '@/ui/separator';

export default function FormSeparator() {
  const t = useTranslations('Login');

  return (
    <div className='flex items-center justify-between text-silver/90 mb-6 mt-9'>
      <Separator className='w-[45%] bg-silver/90' />
      <span className='font-medium select-none'>{t('or')}</span>
      <Separator className='w-[45%] bg-silver/90' />
    </div>
  );
}
