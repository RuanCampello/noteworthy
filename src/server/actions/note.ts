'use server';

import { currentUser, getNoteById } from '@/queries/note';
import { db, drizzle } from '@/server/db';
import { noteDialogSchema } from '@/schemas';
import { getRandomColour } from '@/utils/colours';
import { helloWorld } from '@/utils/constants/hello-world';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { cache } from 'react';

function getPathnameParams() {
  const origin = headers().get('origin');
  const pathname = headers().get('pathname');
  return { basePath: pathname?.split('/')[1], origin };
}

export async function createNote(values: z.infer<typeof noteDialogSchema>) {
  const fields = noteDialogSchema.safeParse(values);

  if (!fields.success) return;
  let { colour } = fields.data;
  const { name } = fields.data;

  colour === 'random' ? (colour = getRandomColour().name) : colour;

  const user = await currentUser();
  if (!user || !user.id) return;

  // const note = await db.note.create({
  //   data: {
  //     title: name,
  //     colour: colour,
  //     userId: user.id,
  //     content: '',
  //   },
  // });

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
  id: string,
) {
  const fields = noteDialogSchema.safeParse(values);
  if (!fields.success) return;

  let { colour } = fields.data;
  const { name } = fields.data;
  colour === 'random' ? (colour = getRandomColour().name) : colour;
  try {
    await db.note.update({ where: { id }, data: { title: name, colour } });
  } catch (error) {
    console.error(error);
  }
  redirect(`/notes/${id}`);
}

export async function deleteNote(id: string) {
  const [user, selectedNote] = await Promise.all([
    currentUser(),
    getNoteById(id),
  ]);

  if (!user || !selectedNote?.id || selectedNote.userId !== user.id) {
    return;
  }

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
  content: string,
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

export async function togglePublishState(id: string, currentState: boolean) {
  try {
    const [note, user] = await Promise.all([getNoteById(id), currentUser()]);
    if (!note || user?.id !== note.userId) return;

    await db.note.update({ where: { id }, data: { isPublic: !currentState } });
    const { basePath } = getPathnameParams();

    if (basePath) {
      revalidatePath(`${basePath}/${id}`);
    }
  } catch (error) {
    console.error(error);
    return;
  }
}

export const getNote = cache(async (id: string) => {
  try {
    const note = await db.note.findUnique({ where: { id } });

    return note;
  } catch (error) {
    return null;
  }
});

export async function createFastNote() {
  const user = await currentUser();
  if (!user || !user?.id) return;

  try {
    const colour = getRandomColour().name;
    const response = await fetch('https://dummyjson.com/quotes/random');
    const data = await response.json();

    const note = await db.note.create({
      data: { colour, content: '', title: data['quote'], userId: user.id },
    });
    return note;
  } catch (error) {
    return null;
  }
}
