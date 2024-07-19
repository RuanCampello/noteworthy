'use server';

import { db } from '@/server/db';
import { cache } from 'react';
import { z } from 'zod';
import { userPreferencesSchema } from '@/schemas';
import { currentUser } from '@/queries/note';

export const getUserPreferences = cache(async (userId: string) => {
  const preferences = await db.userPreferences.findUnique({
    where: { userId },
  });

  if (!preferences) return null;
  return preferences;
});

export async function createUserPreferences(userId: string) {
  await db.userPreferences.create({
    data: {
      userId,
    },
  });
}

export async function updateUserPreferences(
  values: z.infer<typeof userPreferencesSchema>,
) {
  const user = await currentUser();
  const fields = userPreferencesSchema.safeParse(values);
  if (!fields.success || !user || !user?.id) return;

  const { noteFormat, fullNote } = fields.data;
  const preferences = await getUserPreferences(user.id);
  if (!preferences) {
    await createUserPreferences(user.id);
  }

  await db.userPreferences.update({
    where: { userId: user.id },
    data: {
      noteFormat,
      fullNote,
    },
  });
}
