import 'server-only';

import { auth } from '@/auth/auth';
import { drizzle as db } from '@/server/db';
import { type Note, note, user } from '@/server/db/schema';
import { and, count, eq } from 'drizzle-orm';
import { cache } from 'react';

export const currentUser = cache(async () => {
  const session = await auth();
  return session?.user;
});

export const getNoteById = cache(async (id: string) => {
  try {
    return await db.query.note.findFirst({
      where: eq(note.id, id),
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
        .from(note)
        .where(
          and(
            eq(note.userId, userId),
            eq(note.isArchived, isArchived),
            eq(note.isFavourite, isFavourite),
          ),
        );
    } catch (error) {
      return null;
    }
  },
);
export const getNoteByIdWithPreferences = cache(async (id: string) => {
  try {
    return db.query.note.findFirst({
      where: eq(user.id, id),
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
    const response = await db.query.note.findFirst({
      where: eq(note.id, noteId),
      columns: { isPublic: true },
    });

    return !!response?.isPublic;
  } catch (error) {
    console.error(error);
    return null;
  }
});

export const countNoteNumber = cache(
  async (userId: string, favourite: boolean, archive: boolean) => {
    const [{ count: noteNumber }] = await db
      .select({ count: count() })
      .from(note)
      .where(
        and(
          eq(note.userId, userId),
          eq(note.isFavourite, favourite),
          eq(note.isArchived, archive),
        ),
      );
    return noteNumber;
  },
);
