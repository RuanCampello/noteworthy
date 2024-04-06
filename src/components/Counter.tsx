import { db } from '@/db';
import AnimatedCounter from './AnimatedCounter';
import { currentUser } from '@/data/note';

interface CounterProps {
  isFavourite?: boolean;
  isArchived?: boolean;
}

export default async function Counter({
  isFavourite,
  isArchived,
}: CounterProps) {
  const user = await currentUser();
  const userId = user?.id;
  if (!userId) return;

  const condition = isFavourite
    ? { userId, isFavourite }
    : isArchived
    ? { userId, isArchived }
    : { userId };

  const notesNumber: number = await db.note.count({ where: condition });

  return (
    <div
      className={`bg-midnight text-silver overflow-hidden select-none px-2 h-6 text-center items-center md:flex hidden rounded-sm group-hover:border-silver border-2 border-transparent ${
        notesNumber <= 0 && 'md:hidden hidden'
      }`}
    >
      <AnimatedCounter value={notesNumber} />
    </div>
  );
}
