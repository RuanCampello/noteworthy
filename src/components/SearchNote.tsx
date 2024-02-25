'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Search } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const filtersSchema = z.object({
  name: z.string(),
});

type FiltersSchema = z.infer<typeof filtersSchema>;

export default function SearchNote() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const { register, handleSubmit } = useForm<FiltersSchema>({
    resolver: zodResolver(filtersSchema),
  });

  function handleFilters({ name }: FiltersSchema) {
    if (name) {
      const params = new URLSearchParams(searchParams);
      params.set('name', name);
      router.push(`${pathname}?${params.toString()}`);
    } else {
      router.push(pathname);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(handleFilters)}
      className='mx-5 my-1 flex bg-midnight text-silver rounded-sm items-center gap-2 p-2'
    >
      <Search size={20} />
      <input
        {...register('name')}
        className='w-full rounded-sm text-base leading-5 bg-midnight text-silver focus:outline-none font-medium'
        placeholder='Search a note'
      />
    </form>
  );
}
