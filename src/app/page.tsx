import Placeholder from '@/components/Placeholder';
import Sidebar from '@/components/Sidebar';
import { FileText } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export default async function Home() {
  const t = await getTranslations('HomePlaceholder');

  return (
    <div className='flex w-full relative h-screen'>
      <Sidebar />
      <Placeholder paragraph={t('description')} text={t('title')}>
        <FileText size={80} strokeWidth={1} />
      </Placeholder>
    </div>
  );
}
