'use server';

import { signIn } from '@/auth/auth';
import { getUserByEmail } from '@/queries/user';
import { DEFAULT_REDIRECT } from '@/routes';
import { registerFormSchema } from '@/schemas';
import { db } from '@/server/db';
import { user as userTable } from '@/server/db/schema';
import bcrypt from 'bcryptjs';
import { AuthError } from 'next-auth';
import { getTranslations } from 'next-intl/server';
import { z } from 'zod';
import { createPlaceholderNote } from './note';

export async function register(
  values: z.infer<typeof registerFormSchema>,
): Promise<{ error: string | null }> {
  const t = await getTranslations('ServerErrors');
  const fields = registerFormSchema.safeParse(values);

  if (!fields.success) return { error: t('inv_field') };

  const { email, password, username } = fields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const owner = await getUserByEmail(email);
  if (owner) return { error: t('email_taken') };

  const [user] = await db
    .insert(userTable)
    .values({
      name: username,
      email,
      password: hashedPassword,
    })
    .returning();
  await createPlaceholderNote(user.id);
  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: DEFAULT_REDIRECT,
    });
    return { error: null };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: t('inv_credentials') };
        default:
          return { error: t('default_error') };
      }
    }
    throw error;
  }
}
