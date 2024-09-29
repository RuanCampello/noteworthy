import { currentUser } from '@/actions';
import { env } from '@/env';
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

  const subdir = isFavourite
    ? '?is_fav=true&is_arc=false'
    : isArchived
      ? '?is_fav=false&is_arc=true'
      : '?is_fav=false&is_arc=false';

  const response = await fetch(`${env.INK_HOSTNAME}/notes/count${subdir}`, {
    method: 'get',
    headers: { Authorization: `Bearer ${user.accessToken}` },
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
