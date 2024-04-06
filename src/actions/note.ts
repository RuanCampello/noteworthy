'use server';

import { currentUser } from '@/data/note';
import { db } from '@/db';
import { noteDialogSchema } from '@/schemas';
import { getRandomColour } from '@/utils/colours';
import { revalidatePath } from 'next/cache';
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

export async function toggleNoteFavourite(id: string, userId: string) {
  const note = await db.note.findUnique({ where: { id, userId } });
  if (!note) return;
  if (note.isFavourite === true) {
    await db.note.update({
      where: { id, userId },
      data: { isFavourite: false },
    });
  } else if (note.isFavourite === false) {
    await db.note.update({
      where: { id, userId },
      data: { isFavourite: true },
    });
  }

  revalidatePath(`/notes/${id}`);
}

export async function editNote(
  values: z.infer<typeof noteDialogSchema>,
  id: string
) {
  const fields = noteDialogSchema.safeParse(values);
  if (!fields.success) return;

  let { name, colour } = fields.data;
  colour === 'random' ? (colour = getRandomColour().name) : colour;
  try {
    await db.note.update({ where: { id }, data: { title: name, colour } });
  } catch (error) {
    console.error(error);
  }
  redirect(`/notes/${id}`);
}

export async function deleteNote(id: string) {
  await db.note.delete({ where: { id } });
  redirect('/')
}
