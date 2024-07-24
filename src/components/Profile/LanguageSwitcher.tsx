import Auriverde from '@/assets/flags/auriverde.png';
import UnionJack from '@/assets/flags/union_jack.png';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/select';
import { useLocale } from 'next-intl';
import Image from 'next/image';

interface LanguageSwitcherProps {
  onChange: () => void;
}

export default function LanguageSwitcher({ onChange }: LanguageSwitcherProps) {
  const locale = useLocale();

  return (
    <Select onValueChange={onChange} defaultValue={locale}>
      <SelectTrigger className='bg-black col-span-2'>
        <SelectValue className='w-full' placeholder={locale} />
      </SelectTrigger>
      <SelectContent className='dark bg-black'>
        <SelectGroup>
          <SelectItem
            className='text-neutral-200 focus:text-neutral-300'
            value='english'
          >
            <div className='flex gap-1.5 items-center'>
              <Image
                src={UnionJack}
                className='w-4 h-4 rounded-full'
                alt='flag of the united kingdom'
              />
              <p>English</p>
            </div>
          </SelectItem>
          <SelectItem
            className='text-neutral-200 focus:text-neutral-300'
            value='portuguese'
          >
            <div className='flex gap-1.5 items-center'>
              <Image
                src={Auriverde}
                className='w-4 h-4 rounded-full'
                alt='flag of brazil'
              />
              <p>Português</p>
            </div>
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
