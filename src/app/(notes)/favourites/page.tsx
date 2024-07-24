import Placeholder from '@/components/Placeholder';
import { Sparkles } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export default async function FavouritesPage() {
  const t = await getTranslations('FavouritePlaceholder');

  return (
    <Placeholder paragraph={t('description')} text={t('title')}>
      <Sparkles size={80} strokeWidth={1} />
    </Placeholder>
  );
}
