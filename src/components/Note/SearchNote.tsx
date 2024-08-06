'use client';

import { formatSearchParams } from '@/utils/format';
import { zodResolver } from '@hookform/resolvers/zod';
import { Search, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const filtersSchema = z.object({
  name: z.string(),
});

type FiltersSchema = z.infer<typeof filtersSchema>;

export default function SearchNote() {
  const searchParams = useSearchParams().get('name');
  const searchParamsString = searchParams?.toString();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations('Sidebar');
  const params = new URLSearchParams(searchParamsString);

  const { register, handleSubmit, reset } = useForm<FiltersSchema>({
    resolver: zodResolver(filtersSchema),
  });

  function handleFilters({ name }: FiltersSchema) {
    if (name) {
      if (!searchParams) {
        params.append('name', name);
        router.push(`?${params.toString()}`);
        router.refresh();
      } else {
        params.delete('name', searchParams);
        params.delete(searchParams);
        params.append('name', name);
        router.push(`?${params.toString()}`);
        router.refresh();
      }
    } else {
      router.push(pathname);
      router.refresh();
    }
  }
  function handleCleanFilters(): void {
    params.delete('name');
    reset({ name: '' });
    router.push(pathname);
  }

  return (
    <form
      onSubmit={handleSubmit(handleFilters)}
      className='w-full my-1 md:flex hidden bg-midnight text-silver rounded-sm items-center gap-2 p-2 focus-within:outline focus-within:outline-2 focus-within:outline-white'
    >
      <Search size={20} className='shrink-0' />
      <input
        {...register('name')}
        defaultValue={formatSearchParams(searchParamsString || '')}
        className='w-full rounded-sm text-base leading-5 bg-midnight text-silver focus:outline-none font-medium placeholder:truncate'
        placeholder={t('search_note')}
      />
      {searchParams && (
        <button
          className='rounded-full'
          type='button'
          onClick={handleCleanFilters}
        >
          <X className='shrink-0' size={20} />
        </button>
      )}
    </form>
  );
}
