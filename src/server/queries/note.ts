import 'server-only';

import { auth } from '@/auth/auth';
import { drizzle as db } from '@/server/db';
import { cache } from 'react';
import { and, eq } from 'drizzle-orm';
import { type Note, notes, users } from '@/server/db/schema';

export const currentUser = cache(async () => {
  const session = await auth();
  return session?.user;
});

export const getNoteById = cache(async (id: string) => {
  try {
    return await db.query.notes.findFirst({
      where: eq(notes.id, id),
      with: { owner: { columns: { name: true, id: true } } },
    });
  } catch (error) {
    return null;
  }
});

export const getAllUserNotes = cache(
  async (
    userId: string,
    conditions: Record<string, boolean>,
  ): Promise<Note[] | null> => {
    const isArchived = conditions.isArchived;
    const isFavourite = conditions.isFavourite;

    try {
      return await db
        .select()
        .from(notes)
        .where(
          and(
            eq(notes.userId, userId),
            eq(notes.isArchived, isArchived),
            eq(notes.isFavourite, isFavourite),
          ),
        );
    } catch (error) {
      return null;
    }
  },
);
export const getNoteByIdWithPreferences = cache(async (id: string) => {
  try {
    return db.query.notes.findFirst({
      where: eq(users.id, id),
      with: {
        owner: {
          columns: { id: true, name: true },
          with: { preferences: true },
        },
      },
    });
  } catch (error) {
    console.error(error);
    return null;
  }
});

export const getNoteIsPublic = cache(async (noteId: string) => {
  try {
    const publicity = await db.query.notes.findFirst({
      where: eq(notes.id, noteId),
      columns: { isPublic: true },
    });
    if (!publicity) return null;
    return !!publicity;
  } catch (error) {
    console.error(error);
    return null;
  }
});
