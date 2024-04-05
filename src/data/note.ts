'use server';
import { auth } from '@/auth';
import { db } from '@/db';
import { revalidatePath } from 'next/cache';

export async function currentUser() {
  const session = await auth();
  return session?.user;
}

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

export async function updateNoteContent(userId: string, content: string) {
  try {
    const note = await db.note.update({
      where: { userId },
      data: { content, lastUpdate: new Date() },
    });
    revalidatePath('/notes')
    return note;
  } catch (error) {
    console.error(error);
    return;
  }
}
