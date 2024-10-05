import { getUserLocale } from '@/lib/next-intl';
import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async () => {
  const locale = await getUserLocale();

  return {
    locale,
    messages: (await import(`../public/locales/${locale}/translation.json`))
      .default,
  };
});
