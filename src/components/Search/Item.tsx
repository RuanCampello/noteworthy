import { stripHTMLTags } from '@/utils/format';
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
  content = stripHTMLTags(content);
  const searchRegex = /<search\b[^>]*>(.*?)<\/search>/gi;
  const matchArray = Array.from(content.matchAll(searchRegex));
  const contentArray = content.split(searchRegex);

  return (
    <Link
      href={id}
      key={id}
      className='w-full flex items-center gap-2 focus:outline-none'
    >
      <div className={`group-aria-selected:bg-slate bg-night rounded-sm p-1`}>
        {cloneElement(icon, {
          className: 'shrink-0 w-3 h-3',
          strokeWidth: 1.75,
        })}
      </div>
      <div className='leading-none truncate'>
        <h4 className='group-aria-selected:text-slate font-medium truncate'>
          {title}
        </h4>
        <p className='text-xs text-muted-foreground truncate'>
          {matchArray && matchArray[0] ? (
            <RenderContent content={contentArray} match={matchArray} />
          ) : (
            content
          )}
        </p>
      </div>
      <ChevronRight className='w-3 h-3 shrink-0 ms-auto' />
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
