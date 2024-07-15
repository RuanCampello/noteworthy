import 'server-only';

import { auth } from '@/auth/auth';
import { db } from '@/server/db';
import { cache } from 'react';

export const currentUser = cache(async () => {
  const session = await auth();
  return session?.user;
});

export async function getNoteById(id: string) {
  try {
    const note = await db.note.findUnique({ where: { id } });
    return note;
  } catch (error) {
    return null;
  }
}

export async function getAllUserNotes(userId: string) {
  try {
    const notes = await db.note.findMany({ where: { userId } });
    return notes;
  } catch (error) {
    return null;
  }
}

export async function getAllUserOrdinaryNotes(userId: string) {
  try {
    const notes = await db.note.findMany({
      where: { userId, isArchived: false, isFavourite: false },
    });
    return notes;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getAllUserFavouriteNotes(userId: string) {
  try {
    const notes = await db.note.findMany({
      where: { userId, isFavourite: true },
    });
    return notes;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getAllUserArchivedNotes(userId: string) {
  try {
    const notes = await db.note.findMany({
      where: { userId, isArchived: true },
    });
    return notes;
  } catch (error) {
    console.error(error);
    return null;
  }
}
