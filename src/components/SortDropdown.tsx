'use client';

import { List } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

type DropdownValue = { value: string; text: string };

export default function SortDropdown() {
  const searchParams = useSearchParams();
  const filterParams = searchParams.get('filter');
  const router = useRouter();
  const t = useTranslations('SortDropdown');
  const params = new URLSearchParams(searchParams);
  const filter = filterParams || 'last-modified';

  const dropdownValues: DropdownValue[] = [
    { value: 'last-modified', text: t('last_mod') },
    { value: 'title', text: t('title') },
    { value: 'date-new', text: t('date_new') },
    { value: 'date-old', text: t('date_old') },
  ];

  function handleSort(selectedItem: string) {
    if (!filterParams) {
      params.append('filter', selectedItem);
      router.push(`?${params}`);
    } else {
      params.delete('filter', filterParams);
      params.append('filter', selectedItem);
      router.push(`?${params}`);
    }
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className='bg-midnight text-silver p-2 rounded-sm md:inline hidden'>
          <List size={24} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='dark bg-black'>
        <DropdownMenuLabel>{t('sort_by')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={filter || 'last-modified'}>
          {dropdownValues.map((dropdownValue) => (
            <button
              className='flex w-full'
              key={dropdownValue.value}
              onClick={() => handleSort(dropdownValue.value)}
              name='item'
              type='submit'
            >
              <DropdownMenuRadioItem
                value={dropdownValue.value}
                className='w-full'
              >
                {dropdownValue.text}
              </DropdownMenuRadioItem>
            </button>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
