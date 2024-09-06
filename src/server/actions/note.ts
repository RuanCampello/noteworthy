'use server';

import { currentUser, getNoteById } from '@/queries/note';
import { noteDialogSchema } from '@/schemas';
import { db } from '@/server/db';
import { note } from '@/server/db/schema';
import { getRandomColour } from '@/utils/colours';
import { helloWorld } from '@/utils/constants/hello-world';
import { and, eq } from 'drizzle-orm';
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
  const { colour, name } = fields.data;

  const user = await currentUser();
  if (!user) return;

  // @ts-ignore
  const response = await fetch('http://localhost:6969/notes', {
    method: 'post',
    headers: [
      { 'content-type': 'application/json' },
      { 'authorization bearer: ': user },
    ],
    body: JSON.stringify({
      // user_id: 'clwf5smlj0000feuj3qzj3pd',
      user_id: user.id!,
      title: name,
      content: 'this must have been hard...',
      colour: colour,
    }),
  });
  console.log(response);

  // const { origin, basePath } = getPathnameParams();

  // if (!basePath || basePath === 'favourites' || basePath === 'archived') {
  //   redirect(`${origin}/notes/${id}`);
  // }
  // //if user is already in notes path, but not on favourite/archive page
  // redirect(`${origin}/${basePath}/${id}`);
}

export async function toggleNoteFavourite(id: string, userId: string) {
  const { basePath, origin } = getPathnameParams();

  const selectedNote = await getNoteById(id);
  if (!selectedNote || selectedNote.userId !== userId) return;

  if (!selectedNote.isArchived) {
    if (selectedNote.isFavourite === true) {
      await db
        .update(note)
        .set({ isFavourite: false, lastUpdate: new Date() })
        .where(and(eq(note.id, id), eq(note.userId, userId)));
    } else {
      await db
        .update(note)
        .set({ isFavourite: true, lastUpdate: new Date() })
        .where(and(eq(note.id, id), eq(note.userId, userId)));
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

  const selectedNote = await getNoteById(id);
  if (!selectedNote || selectedNote.userId !== userId) return;

  if (!selectedNote.isFavourite) {
    if (selectedNote.isArchived == true) {
      await db
        .update(note)
        .set({ isArchived: false, lastUpdate: new Date() })
        .where(and(eq(note.id, id), eq(note.userId, userId)));
    } else {
      await db
        .update(note)
        .set({ isArchived: true, lastUpdate: new Date() })
        .where(and(eq(note.id, id), eq(note.userId, userId)));
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
  const { basePath } = getPathnameParams();

  let { colour } = fields.data;
  const { name } = fields.data;
  colour === 'random' ? (colour = getRandomColour().name) : colour;
  try {
    await db
      .update(note)
      .set({ title: name, colour: colour, lastUpdate: new Date() })
      .where(eq(note.id, id));
  } catch (error) {
    console.error(error);
  }
  redirect(`/${basePath}/${id}`);
}

export async function deleteNote(id: string) {
  const [user, selectedNote] = await Promise.all([
    currentUser(),
    getNoteById(id),
  ]);

  if (!user || !selectedNote?.id || selectedNote.userId !== user.id) {
    return;
  }

  await db.delete(note).where(eq(note.id, id));
  redirect('/');
}

export async function createPlaceholderNote(userId: string) {
  const { name } = getRandomColour();

  await db.insert(note).values({
    colour: name,
    content: helloWorld,
    title: 'Hello World 📝',
    userId,
  });
}

export async function updateNoteContent(
  id: string,
  userId: string,
  content: string,
) {
  const { basePath } = getPathnameParams();
  try {
    await db
      .update(note)
      .set({
        content: content,
        lastUpdate: new Date(),
      })
      .where(and(eq(note.id, id), eq(note.userId, userId)));
    revalidatePath(`/${basePath}`, 'layout');
  } catch (error) {
    console.error(error);
    return;
  }
}

export async function togglePublishState(id: string, currentState: boolean) {
  try {
    const [selectedNote, user] = await Promise.all([
      getNoteById(id),
      currentUser(),
    ]);
    if (!selectedNote || user?.id !== selectedNote.userId) return;

    await db
      .update(note)
      .set({
        isPublic: !currentState,
      })
      .where(eq(note.id, id));
    const { basePath } = getPathnameParams();

    if (basePath) {
      revalidatePath(`${basePath}/${id}`);
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function createFastNote() {
  const user = await currentUser();
  if (!user || !user?.id) return;

  try {
    const colour = getRandomColour().name;

    const response = await fetch('https://dummyjson.com/quotes/random');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const quote = 'some random quote that (not) came from api';

    const [{ id }] = await db
      .insert(note)
      .values({
        colour,
        content: '',
        title: data['quote'] || quote,
        userId: user.id,
      })
      .returning();

    return id;
  } catch (error) {
    console.error('Error creating fast note:', error);
    return null;
  }
}
