import 'server-only';

import { auth } from '@/auth/auth';
import { db } from '@/server/db';
import { cache } from 'react';
import { Note } from '@prisma/client';

export const currentUser = cache(async () => {
  const session = await auth();
  return session?.user;
});

export const getNoteById = cache(async (id: string) => {
  try {
    const note = await db.note.findUnique({
      where: { id },
      include: { owner: { select: { name: true, id: true } } },
    });
    return note;
  } catch (error) {
    return null;
  }
});

export const getAllUserNotes = cache(
  async (
    userId: string,
    conditions: Record<string, boolean>,
  ): Promise<Note[] | null> => {
    try {
      const notes = await db.note.findMany({
        where: { userId, ...conditions },
      });
      return notes;
    } catch (error) {
      return null;
    }
  },
);
export const getNoteByIdWithPreferences = cache(async (id: string) => {
  try {
    return await db.note.findUnique({
      where: { id },
      include: {
        owner: { select: { name: true, id: true, Preferences: true } },
      },
    });
  } catch (error) {
    return null;
  }
});

export const getNoteIsPublic = cache(async (noteId: string) => {
  try {
    const note = await db.note.findUnique({
      where: { id: noteId },
    });
    if (!note) return null;
    if (note.isPublic) return true;
    return false;
  } catch (error) {
    console.error(error);
    return null;
  }
});
