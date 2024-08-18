import { Note } from '@/types/database-types';
import { Colours } from '@/utils/colours';
import { stripHTMLTags } from '@/utils/format';
import { formatDistanceToNow } from 'date-fns';
import { NotebookText } from 'lucide-react';

interface NoteWidgetProps extends Note {
  user: {
    name: string | null;
  };
}

export default function NoteWidget({
  title,
  content,
  colour,
  lastUpdate,
  user,
}: NoteWidgetProps) {
  content = stripHTMLTags(content);
  const date = formatDistanceToNow(lastUpdate, { addSuffix: true });

  return (
    <article className='border border-midnight p-3 rounded-lg max-w-52 flex flex-col gap-3'>
      <header className='flex items-center gap-2'>
        <div
          className='p-[3px] rounded-sm'
          style={{ backgroundColor: Colours[colour] }}
        >
          <NotebookText className='w-4 h-4 text-midnight' strokeWidth={2.5} />
        </div>
        <h3 className='font-garamound font-medium text-lg truncate'>{title}</h3>
      </header>
      <p className='line-clamp-6 leading-snug text-silver text-sm'>{content}</p>
      <footer className='text-sm text-silver/80 flex justify-between gap-2'>
        <span className='text-silver truncate'>{user.name}</span>
        <span className='shrink-0'>{date}</span>
      </footer>
    </article>
  );
}
