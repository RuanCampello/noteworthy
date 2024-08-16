import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/ui/accordion';
import { Folder, FolderOpen } from 'lucide-react';

export default function FolderCollapsible() {
  return (
    <Accordion type='single' collapsible>
      <AccordionItem className='px-5 py-2.5' value='folders'>
        <AccordionTrigger className='pb-2 group transition-transform'>
          <div className='flex gap-4'>
            <Folder className='group-data-[state=open]:hidden' />
            <FolderOpen className='group-data-[state=closed]:hidden' />
            <span className='truncate'>Folders</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className='flex border-l-2 border-silver h-fit leading-none mx-2 ps-2 py-2'>
          some folder
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
