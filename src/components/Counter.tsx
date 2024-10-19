import { currentUser } from '@/actions';
import { env } from '@/env';
import { Tag } from '@/utils/constants/filters';
import AnimatedCounter from './AnimatedCounter';

interface CounterProps {
  isFavourite?: boolean;
  isArchived?: boolean;
}

export default async function Counter({
  isFavourite,
  isArchived,
}: CounterProps) {
  const user = await currentUser();
  if (!user || !user?.accessToken) return;

  let subdir = '';
  if (isFavourite) subdir = '?is_fav=true';
  else if (isArchived) subdir = '?is_arc=true';

  const tag = isFavourite
    ? Tag.Counter.Favourites
    : isArchived
      ? Tag.Counter.Archived
      : Tag.Counter.All;

  const response = await fetch(`${env.INK_HOSTNAME}/notes/count${subdir}`, {
    method: 'get',
    headers: { Authorization: `Bearer ${user.accessToken}` },
    next: {
      tags: [tag],
    },
    cache: 'force-cache',
  });

  const notesNumber = await response.json();

  return (
    <div
      className={`bg-midnight text-silver overflow-hidden select-none px-2 h-6 text-center items-center md:flex hidden rounded-sm group-hover:border-silver border-2 border-transparent group-data-[state=closed]/root:hidden ${
        notesNumber <= 0 && 'md:hidden hidden'
      }`}
    >
      <AnimatedCounter value={notesNumber} />
    </div>
  );
}
