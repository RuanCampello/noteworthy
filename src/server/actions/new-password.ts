'use server';

import { getPasswordResetTokenByToken } from '@/queries/password-reset-token';
import { getUserByEmail } from '@/queries/user';
import { newPasswordSchema } from '@/schemas';
import { z } from 'zod';
import bycrpt from 'bcryptjs';
import { db } from '@/server/db';

export async function newPassword(
  values: z.infer<typeof newPasswordSchema>,
  token?: string | null
) {
  if (!token) return { error: 'Token is required' };

  const fields = newPasswordSchema.safeParse(values);
  if (!fields.success) return { error: 'This password is invalid' };

  const { password } = fields.data;
  const existingToken = await getPasswordResetTokenByToken(token);
  if (!existingToken) return { error: 'Invalid token' };

  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) return { error: 'Token has expired' };

  const existingUser = await getUserByEmail(existingToken.email);
  if (!existingUser) return { error: 'E-mail not found' };

  const hashedPassword = await bycrpt.hash(password, 10);
  await db.user.update({
    where: { id: existingUser.id },
    data: { password: hashedPassword },
  });
  await db.passwordResetToken.delete({ where: { id: existingToken.id } });

  return { success: 'Password updated!' };
}
