'use server';

import { currentUser } from '@/actions';
import { setUserLocale } from '@/lib/next-intl';
import { userPreferencesSchema } from '@/schemas';
import { db } from '@/server/db';
import { userPreferences } from '@/server/db/schema';
import { eq } from 'drizzle-orm';
import { cache } from 'react';
import { z } from 'zod';

export const getUserPreferences = cache(async (userId: string) => {
  const preferences = await db.query.userPreferences.findFirst({
    where: eq(userPreferences.userId, userId),
  });

  if (!preferences) return null;
  return preferences;
});

export async function createUserPreferences(userId: string) {
  await db.insert(userPreferences).values({
    userId,
  });
}

export async function updateUserPreferences(
  values: z.infer<typeof userPreferencesSchema>,
) {
  const user = await currentUser();
  const fields = userPreferencesSchema.safeParse(values);

  if (!fields.success || !user || !user?.id) return;

  const { noteFormat, fullNote, language } = fields.data;
  await setUserLocale(language);
  const preferences = await getUserPreferences(user.id);
  if (!preferences) {
    await createUserPreferences(user.id);
  }

  await db
    .update(userPreferences)
    .set({
      noteFormat,
      fullNote,
    })
    .where(eq(userPreferences.userId, user.id));
}
