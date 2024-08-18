import 'server-only';

import { auth } from '@/auth/auth';
import { db } from '@/server/db';
import { note, user } from '@/server/db/schema';
import type { Note } from '@/types/database-types';
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
      with: { user: { columns: { name: true, id: true } } },
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
        user: {
          columns: { id: true, name: true },
          with: { usersPreferences: true },
        },
      },
    });
  } catch (error) {
    console.error(error);
    return null;
  }
});
export const getAllNotes = cache(async (userId: string) => {
  return db.query.note.findMany({
    where: eq(note.userId, userId),
    with: {
      user: {
        columns: { id: true, name: true },
      },
    },
  });
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
export const countTotalNotes = cache(async (userId: string) => {
  const [{ count: noteNumber }] = await db
    .select({ count: count() })
    .from(note)
    .where(eq(note.userId, userId));
  return noteNumber;
});
