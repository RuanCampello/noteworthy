import { getRequestConfig } from 'next-intl/server';
import { getUserLocale } from './server/actions/locate';

export default getRequestConfig(async () => {
  const locale = await getUserLocale();

  return {
    locale,
    messages: (await import(`../public/locales/${locale}/translation.json`))
      .default,
  };
});
