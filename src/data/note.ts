import { db } from '@/db';

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
