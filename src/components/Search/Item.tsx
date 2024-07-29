import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { cloneElement } from 'react';

interface ItemWrapper {
  id: string;
  content: string;
  title: string;
  icon: JSX.Element;
}

export function NoteItemWrapper({ icon, id, content, title }: ItemWrapper) {
  const dividedContent = content.split(/<b\b[^>]*>(.*?)<\/b>/gi);

  return (
    <Link
      href={id}
      className='w-full flex items-center gap-2 focus:outline-none'
    >
      <div className={`group-aria-selected:bg-slate bg-night rounded-sm p-1`}>
        {cloneElement(icon, {
          className: 'shrink-0 w-3 h-3',
          strokeWidth: 1.75,
        })}
      </div>
      <div className='leading-none truncate'>
        <h4 className='group-aria-selected:text-slate font-medium'>{title}</h4>
        <p className='text-xs text-muted-foreground truncate'>
          {dividedContent[0]}
          <span className='text-slate font-bold'>{dividedContent[1]}</span>
          {dividedContent[2]}
        </p>
      </div>
      <ChevronRight className='w-3 h-3 shrink-0' />
    </Link>
  );
}
