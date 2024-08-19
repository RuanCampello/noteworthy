'use server';

import { newFolderSchema } from '@/schemas';
import { db } from '@/server/db';
import { folder } from '@/server/db/schema';
import { z } from 'zod';

export async function createFolder(values: z.infer<typeof newFolderSchema>) {
  const fields = newFolderSchema.safeParse(values);

  if (!fields.success) return;
  const { name } = fields.data;

  const [{ id }] = await db
    .insert(folder)
    .values({
      name: name,
    })
    .returning();

  return id;
}
