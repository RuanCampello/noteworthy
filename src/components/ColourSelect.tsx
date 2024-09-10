import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/ui/select';
import type { Colour } from '../types/database-types';
import HoverableSelectItem from './HoverableSelectItem';

interface ColourSelectProps {
  defaultColour: 'random' | Colour;
  onValueChange: () => void;
  disabled?: boolean;
  colour?: string;
}

export default function ColourSelect({
  defaultColour,
  onValueChange,
  disabled,
  colour,
}: ColourSelectProps) {
  const colours = [
    { value: 'slate', name: 'dark slate blue' },
    { value: 'wisteria', name: 'wisteria' },
    { value: 'tickle', name: 'tickle me pick' },
    { value: 'melon', name: 'melon' },
    { value: 'sunset', name: 'sunset' },
    { value: 'mindaro', name: 'mindaro' },
    { value: 'cambridge', name: 'cambridge blue' },
    { value: 'tiffany', name: 'tiffany blue' },
    { value: 'blue', name: 'non photo blue' },
    { value: 'mikado', name: 'mikado yellow' },
  ];

  return (
    <Select
      disabled={disabled}
      defaultValue={defaultColour}
      onValueChange={onValueChange}
      name='colour'
    >
      <SelectTrigger
        style={{ outlineColor: colour }}
        className='bg-black capitalize col-span-3'
      >
        <SelectValue className='w-full' placeholder={defaultColour} />
      </SelectTrigger>
      <SelectContent
        side='right'
        align='center'
        sideOffset={24}
        className='dark bg-black'
      >
        <SelectGroup className='flex flex-col gap-1'>
          <SelectLabel>Colours</SelectLabel>
          <SelectItem
            className='text-neutral-200 focus:text-neutral-300'
            value='random'
          >
            Random
          </SelectItem>
          {colours.map((colour) => (
            <HoverableSelectItem
              key={colour.value}
              value={colour.value as Colour}
              name={colour.name}
            />
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
