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

const dropdownValues = [
  { value: 'date-new', text: 'Date added (newest)'},
  { value: 'date-old', text: 'Date added (oldest)'},
  { value: 'title', text: 'Title'},
];

export default function SortDropdown() {
  const searchParams = useSearchParams();
  const filterParams = searchParams.get('filter');
  const params = new URLSearchParams(searchParams);
  const router = useRouter();
  const filter = filterParams || ''

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
        <button className='bg-midnight text-silver p-2 rounded-sm'>
          <List size={24} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='dark bg-black'>
        <DropdownMenuLabel>Sort by</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={filter}>
          {dropdownValues.map((dropdownValue) => (
            <button
              className='flex w-full'
              key={dropdownValue.value}
              onClick={() => handleSort(dropdownValue.value)}
              name='item'
              type='submit'
            >
              <DropdownMenuRadioItem value={dropdownValue.value} className='w-full'>
                {dropdownValue.text}
              </DropdownMenuRadioItem>
            </button>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
