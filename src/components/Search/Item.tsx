import { ChevronRight } from 'lucide-react';
import { type AnchorHTMLAttributes, cloneElement, forwardRef } from 'react';

interface ItemWrapper extends AnchorHTMLAttributes<HTMLAnchorElement> {
  icon: JSX.Element;
  content?: string;
  title: string;
}

export const CommandItem = forwardRef<HTMLAnchorElement, ItemWrapper>(
  ({ icon, content, title, ...props }, ref) => (
    <a
      ref={ref}
      href={props.href!}
      className='w-full flex items-center gap-2 focus:outline-none overflow-hidden shrink-0 p-2 group aria-selected:bg-midnight rounded-md'
      {...props}
    >
      <div
        className={`group-aria-selected:bg-slate w-fit bg-night rounded-sm p-1`}
      >
        {cloneElement(icon, {
          className: 'shrink-0 w-5 h-5',
          strokeWidth: 1.75,
        })}
      </div>
      <div className='truncate'>
        <h4 className='group-aria-selected:text-slate text-sm leading-tight font-medium truncate'>
          {title}
        </h4>
        <p
          className='text-xs text-muted-foreground truncate leading-none'
          dangerouslySetInnerHTML={{ __html: content! }}
        />
      </div>
      <ChevronRight className='w-4 h-4 shrink-0 ms-auto' />
    </a>
  ),
);
