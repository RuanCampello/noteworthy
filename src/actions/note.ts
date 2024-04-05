'use server';

import { currentUser } from '@/data/note';
import { db } from '@/db';
import { noteDialogSchema } from '@/schemas';
import { getRandomColour } from '@/utils/colours';
import { redirect } from 'next/navigation';
import { z } from 'zod';

export async function createNote(values: z.infer<typeof noteDialogSchema>) {
  const fields = noteDialogSchema.safeParse(values);

  if (!fields.success) return;
  let { name, colour } = fields.data;

  colour === 'random' ? (colour = getRandomColour().name) : colour;

  const user = await currentUser();
  if (!user || !user.id) return;

  const note = await db.note.create({
    data: {
      title: name,
      colour: colour,
      userId: user.id,
      content: '',
    },
  });

  redirect(`notes/${note.id}`);
}
