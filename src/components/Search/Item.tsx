import { stripHTMLTags } from '@/utils/format';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { cloneElement, type HTMLAttributes } from 'react';

interface ItemWrapper extends HTMLAttributes<HTMLAnchorElement> {
  icon: JSX.Element;
  id: string;
  content: string;
  title: string;
}

export function NoteItemWrapper({
  icon,
  id,
  content,
  title,
  ...props
}: ItemWrapper) {
  content = stripHTMLTags(content);
  const searchRegex = /<search\b[^>]*>(.*?)<\/search>/gi;
  const matchArray = Array.from(content.matchAll(searchRegex));
  const contentArray = content.split(searchRegex);

  return (
    <Link
      href={id}
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
        <p className='text-xs text-muted-foreground truncate leading-none'>
          {matchArray && matchArray[0] ? (
            <RenderContent content={contentArray} match={matchArray} />
          ) : (
            content
          )}
        </p>
      </div>
      <ChevronRight className='w-4 h-4 shrink-0 ms-auto' />
    </Link>
  );
}

interface RenderContentProps {
  content: string[];
  match: RegExpExecArray[];
}

function RenderContent({ content, match }: RenderContentProps) {
  const combinedContent = content.flatMap((c, i) =>
    match.some((m) => m[1] === c)
      ? [{ key: c + i, text: c, highlighted: true }]
      : [{ key: c + i, text: c, highlighted: false }],
  );

  return (
    <span className='truncate'>
      {combinedContent.map(({ key, text, highlighted }) => {
        console.log(key, text);
        if (highlighted) {
          return (
            <span className='text-slate' key={key}>
              {text}
            </span>
          );
        } else return <span key={key}>{text}</span>;
      })}
    </span>
  );
}
