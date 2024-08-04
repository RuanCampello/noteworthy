'use server';

import { getPasswordResetTokenByToken } from '@/queries/password-reset-token';
import { getUserByEmail } from '@/queries/user';
import { newPasswordSchema } from '@/schemas';
import { db } from '@/server/db';
import { passwordResetTokens, user } from '@/server/db/schema';
import bycrpt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { getTranslations } from 'next-intl/server';
import { z } from 'zod';

export async function newPassword(
  values: z.infer<typeof newPasswordSchema>,
  token?: string | null,
) {
  const t = await getTranslations('ServerErrors');
  if (!token) return { error: t('no_token') };

  const fields = newPasswordSchema.safeParse(values);
  if (!fields.success) return { error: t('inv_password') };

  const { password } = fields.data;
  const existingToken = await getPasswordResetTokenByToken(token);
  if (!existingToken) return { error: t('inv_token') };

  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) return { error: t('token_exp') };

  const existingUser = await getUserByEmail(existingToken.email);
  if (!existingUser) return { error: t('email_not_found') };

  const hashedPassword = await bycrpt.hash(password, 10);
  await db
    .update(user)
    .set({
      password: hashedPassword,
    })
    .where(eq(user.id, existingUser.id));
  await db
    .delete(passwordResetTokens)
    .where(eq(passwordResetTokens.id, existingToken.id));

  return { success: t('password_update') };
}
