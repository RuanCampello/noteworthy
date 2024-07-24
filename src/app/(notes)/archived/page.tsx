import Placeholder from '@/components/Placeholder';
import { Package } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export default async function ArchivedPage() {
  const t = await getTranslations('ArchivePlaceholder');

  return (
    <Placeholder paragraph={t('description')} text={t('title')}>
      <Package size={80} strokeWidth={1} />
    </Placeholder>
  );
}
