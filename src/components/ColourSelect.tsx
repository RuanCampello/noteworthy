import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from './ui/select';

export default function ColourSelect() {
  return (
    <Select defaultValue='random' name='colour'>
      <SelectTrigger className='bg-black col-span-3'>
        <SelectValue className='w-full' placeholder='Random' />
      </SelectTrigger>
      <SelectContent side='right' align='center' sideOffset={24} className='dark bg-black'>
        <SelectGroup className='flex flex-col gap-1'>
          <SelectLabel>Colours</SelectLabel>
          <SelectItem className='text-neutral-200 focus:text-neutral-300' value='random'>
            Random
          </SelectItem>
          <SelectItem
            className='bg-wisteria focus:bg-wisteria/80'
            value='wisteria'
          >
            Wisteria
          </SelectItem>
          <SelectItem className='bg-tickle focus:bg-tickle/80' value='tickle'>
            Tickle me pick
          </SelectItem>
          <SelectItem className='bg-melon focus:bg-melon/80' value='melon'>
            Melon
          </SelectItem>
          <SelectItem className='bg-sunset focus:bg-sunset/80' value='sunset'>
            Sunset
          </SelectItem>
          <SelectItem
            className='bg-mindaro focus:bg-mindaro/80'
            value='mindaro'
          >
            Mindaro
          </SelectItem>
          <SelectItem className='bg-blue focus:bg-blue/80' value='blue'>
            Non photo blue
          </SelectItem>
          <SelectItem
            className='bg-tiffany focus:bg-tiffany/80'
            value='tiffany'
          >
            Tiffany blue
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
