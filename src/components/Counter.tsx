import { db } from '@/db';
import AnimatedCounter from './AnimatedCounter';
import { currentUser } from '@/data/note';

export default async function Counter() {
  const user = await currentUser();
  const userId = user?.id;
  if (!userId) return;
  const notesNumber = await db.user.count({ where: { Note: { userId } } });
  return (
    <div className='bg-midnight text-silver overflow-hidden select-none px-2 h-6 text-center items-center md:flex hidden rounded-sm'>
      <AnimatedCounter value={notesNumber} />
    </div>
  );
}
