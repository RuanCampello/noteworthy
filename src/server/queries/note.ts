import 'server-only';

import { auth } from '@/auth/auth';
import { db } from '@/server/db';
import { cache } from 'react';

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
