'use client';

import { X } from 'lucide-react';
import MenuTooltip from '../Tooltip';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function CloseButton() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const t = useTranslations('Dictionary');

  async function closeDictionary() {
    const params = new URLSearchParams(searchParams);
    if (params.has('dfn-open')) {
      params.delete('dfn-open');
      params.delete('dfn-word');

      router.push(`?${params}`);
      router.refresh();
    } else router.refresh();
  }
  return (
    <MenuTooltip content={t('close_dic')} side='left'>
      <button
        onClick={closeDictionary}
        className='p-1.5 rounded-full text-silver hover:bg-midnight z-50'
      >
        <X size={18} />
      </button>
    </MenuTooltip>
  );
}
