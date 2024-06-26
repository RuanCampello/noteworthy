'use server';

import { currentUser, getNoteById } from '@/queries/note';
import { db } from '@/server/db';
import { noteDialogSchema } from '@/schemas';
import { getRandomColour } from '@/utils/colours';
import { helloWorld } from '@/utils/hello-world';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';

function getPathnameParams() {
  const origin = headers().get('origin');
  const pathname = headers().get('pathname');
  return { basePath: pathname?.split('/')[1], origin };
}

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

  const { origin, basePath } = getPathnameParams();

  if (!basePath || basePath === 'favourites' || basePath === 'archived') {
    redirect(`${origin}/notes/${note.id}`);
  }
  //if user is already in notes path, but not on favourite/archive page
  redirect(`${origin}/${basePath}/${note.id}`);
}

export async function toggleNoteFavourite(id: string, userId: string) {
  const { basePath, origin } = getPathnameParams();

  const note = await db.note.findUnique({ where: { id, userId } });
  if (!note) return;

  if (!note.isArchived) {
    if (note.isFavourite === true) {
      await db.note.update({
        where: { id, userId },
        data: { isFavourite: false, lastUpdate: new Date() },
      });
    } else if (note.isFavourite === false) {
      await db.note.update({
        where: { id, userId },
        data: { isFavourite: true, lastUpdate: new Date() },
      });
    }
  }

  if (basePath === 'favourites') {
    const redirectUrl = new URL(`${origin}/notes/${id}`);
    redirect(redirectUrl.toString());
  } else if (basePath === 'notes') {
    const redirectUrl = new URL(`${origin}/favourites/${id}`);
    redirect(redirectUrl.toString());
  } else {
    revalidatePath('/');
  }
}

export async function toggleNoteArchive(id: string, userId: string) {
  const { basePath, origin } = getPathnameParams();

  const note = await db.note.findUnique({ where: { id, userId } });
  if (!note) return;

  if (!note.isFavourite) {
    if (note.isArchived === true) {
      await db.note.update({
        where: { id, userId },
        data: { isArchived: false, lastUpdate: new Date() },
      });
    } else if (note.isArchived === false) {
      await db.note.update({
        where: { id, userId },
        data: { isArchived: true, lastUpdate: new Date() },
      });
    }
  }

  if (basePath === 'archived') {
    const redirectUrl = new URL(`${origin}/notes/${id}`);
    redirect(redirectUrl.toString());
  } else if (basePath === 'notes') {
    const redirectUrl = new URL(`${origin}/archived/${id}`);
    redirect(redirectUrl.toString());
  }
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
  const user = await currentUser();

  if (!user) return;

  const selectedNote = await getNoteById(id);

  if (!selectedNote?.id) return;
  if (selectedNote.userId !== user.id) return;

  await db.note.delete({ where: { id } });
  redirect('/');
}

export async function createPlaceholderNote(userId: string) {
  const { name } = getRandomColour();
  await db.note.create({
    data: {
      colour: name,
      content: helloWorld,
      title: 'Hello World 📝',
      userId,
    },
  });
}

export async function updateNoteContent(
  id: string,
  userId: string,
  content: string
) {
  try {
    const note = await db.note.update({
      where: { id, userId },
      data: { content, lastUpdate: new Date() },
    });
    revalidatePath('/notes');
    return note;
  } catch (error) {
    console.error(error);
    return;
  }
}
