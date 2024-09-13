'use server';

import { currentUser, getNoteById } from '@/queries/note';
import { db } from '@/server/db';
import { note } from '@/server/db/schema';
import { getRandomColour } from '@/utils/colours';
import { helloWorld } from '@/utils/constants/hello-world';
import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getPathnameParams } from '@/utils/format-notes';

export async function toggleNoteFavourite(id: string) {
  const { basePath, origin } = getPathnameParams();
  const user = await currentUser();
  if (!user || !user?.id) return;

  const selectedNote = await getNoteById(id);
  if (!selectedNote || selectedNote.userId !== user.id) return;

  if (!selectedNote.isArchived) {
    if (selectedNote.isFavourite === true) {
      await db
        .update(note)
        .set({ isFavourite: false, lastUpdate: new Date() })
        .where(and(eq(note.id, id), eq(note.userId, user.id)));
    } else {
      await db
        .update(note)
        .set({ isFavourite: true, lastUpdate: new Date() })
        .where(and(eq(note.id, id), eq(note.userId, user.id)));
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

export async function toggleNoteArchive(id: string) {
  const { basePath, origin } = getPathnameParams();
  const user = await currentUser();
  if (!user || !user?.id) return;

  const selectedNote = await getNoteById(id);
  if (!selectedNote || selectedNote.userId !== user.id) return;

  if (!selectedNote.isFavourite) {
    if (selectedNote.isArchived == true) {
      await db
        .update(note)
        .set({ isArchived: false, lastUpdate: new Date() })
        .where(and(eq(note.id, id), eq(note.userId, user.id)));
    } else {
      await db
        .update(note)
        .set({ isArchived: true, lastUpdate: new Date() })
        .where(and(eq(note.id, id), eq(note.userId, user.id)));
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

export async function createPlaceholderNote(userId: string) {
  const { name } = getRandomColour();

  await db.insert(note).values({
    colour: name,
    content: helloWorld,
    title: 'Hello World 📝',
    userId,
  });
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
    return null;
  }
}
