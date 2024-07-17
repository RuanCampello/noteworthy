'use server';

import { getUserByEmail, userHasProviderAccount } from '@/queries/user';
import { sendPasswordResetEmail } from '@/lib/mail';
import { generatePasswordResetToken } from '@/lib/tokens';
import { resetPasswordSchema } from '@/schemas';
import { z } from 'zod';

export async function resetPassword(
  values: z.infer<typeof resetPasswordSchema>,
) {
  const fields = resetPasswordSchema.safeParse(values);
  if (!fields.success) return { error: 'Invalid e-mail' };

  const { email } = fields.data;
  const user = await getUserByEmail(email);
  if (!user) return { error: 'No user found with this e-mail' };

  const { value: isProviderAccount, provider } = await userHasProviderAccount(
    user.id,
  );

  if (isProviderAccount) {
    return {
      message: `It looks like your account was created by a provider. Try resetting your password with ${provider}.`,
    };
  }

  const passwordResetToken = await generatePasswordResetToken(email);
  if (passwordResetToken.currentToken) {
    return {
      message: `You still have a valid reset token until ${passwordResetToken.currentToken.expires.toLocaleTimeString()}, check out your e-mail.`,
    };
  }
  if (passwordResetToken.newToken)
    await sendPasswordResetEmail(
      passwordResetToken.newToken.email,
      passwordResetToken.newToken.token,
    );
  return { success: 'Reset password e-mail sent' };
}
