import { Note } from '@/types/database-types';
import { Colours } from '@/utils/colours';
import { stripHTMLTags } from '@/utils/format';
import { formatDistanceToNow } from 'date-fns';
import { NotebookText, Package, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface NoteWidgetProps extends Note {
  user: {
    name: string | null;
  };
}

export default function NoteWidget({
  title,
  id,
  content,
  colour,
  lastUpdate,
  user,
  isArchived,
  isFavourite,
}: NoteWidgetProps) {
  content = stripHTMLTags(content);
  const date = formatDistanceToNow(lastUpdate, { addSuffix: true });
  const redirectUrl =
    formatRedirect({
      is_arc: isArchived,
      is_fav: isFavourite,
    }) + id;

  return (
    <Link
      href={redirectUrl}
      role='article'
      className='border border-midnight p-3 rounded-lg max-w-52 flex flex-col justify-between gap-3 select-none'
    >
      <header className='flex items-center gap-2'>
        <div
          className='p-[3px] rounded-sm'
          style={{ backgroundColor: Colours[colour] }}
        >
          {<RenderIcon is_fav={isFavourite} is_arc={isArchived} />}
        </div>
        <h3 className='font-garamound font-medium text-lg truncate'>{title}</h3>
      </header>
      <p className='line-clamp-6 leading-snug text-silver text-sm'>{content}</p>
      <footer className='text-sm text-silver/80 flex justify-between gap-2'>
        <span className='text-silver truncate'>{user.name}</span>
        <span className='shrink-0'>{date}</span>
      </footer>
    </Link>
  );
}

interface Props {
  is_fav: boolean;
  is_arc: boolean;
}

function RenderIcon({ is_fav, is_arc }: Props) {
  const condition = (Number(is_arc) << 1) | Number(is_fav);
  const props = {
    className: 'w-4 h-4 text-midnight',
    strokeWidth: 2.5,
  };

  switch (condition) {
    case 2:
      return <Package {...props} />;
    case 1:
      return <Sparkles {...props} />;
    default:
      return <NotebookText {...props} />;
  }
}

function formatRedirect({ is_arc, is_fav }: Props) {
  const condition = (Number(is_arc) << 1) | Number(is_fav);

  switch (condition) {
    case 2:
      return `/archived/`;
    case 1:
      return `/favourites/`;
    default:
      return `/notes/`;
  }
}
