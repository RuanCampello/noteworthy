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
          {matchArray && matchArray[0] ? (
            <RenderContent content={contentArray} match={matchArray} />
          ) : (
            content
          )}
        </p>
      </div>
      <ChevronRight className='w-3 h-3 shrink-0' />
    </Link>
  );
}

interface RenderContentProps {
  content: string[];
  match: RegExpExecArray[];
}

function RenderContent({ content, match }: RenderContentProps) {
  const combinedContent = content.flatMap((c) =>
    match.some((m) => m[1] === c)
      ? [{ key: c, text: c, highlighted: true }]
      : [{ key: c, text: c, highlighted: false }],
  );

  return (
    <p>
      {combinedContent.map(({ key, text, highlighted }) =>
        highlighted ? (
          <span key={key} className='text-slate font-semibold'>
            {text}
          </span>
        ) : (
          <span key={key}>{text}</span>
        ),
      )}
    </p>
  );
}
