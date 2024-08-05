import { currentUser } from '@/queries/note';
import { API } from '@/server/api';
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
  if (!user || !user.id) return;
  const api = new API();

  let notesNumber;
  if (isFavourite) {
    notesNumber = await api.notes(user.id).favourite.count();
  } else if (isArchived) {
    notesNumber = await api.notes(user.id).archived.count();
  } else {
    notesNumber = await api.notes(user.id).ordinary.count();
  }

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
