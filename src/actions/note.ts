'use server';

import { auth } from '@/auth';
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

  const user = await auth();
  if (!user || !user.user || !user.user.id) return;

  const note = await db.note.create({
    data: {
      title: name,
      colour: colour,
      userId: user.user.id,
      content: '',
    },
  });

  redirect(`notes/${note.id}`);
}
