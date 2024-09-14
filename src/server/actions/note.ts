'use server';

import { currentUser, getNoteById } from '@/queries/note';
import { db } from '@/server/db';
import { note } from '@/server/db/schema';
import { getRandomColour } from '@/utils/colours';
import { helloWorld } from '@/utils/constants/hello-world';
import { getPathnameParams } from '@/utils/format-notes';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

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
