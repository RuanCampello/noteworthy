'use server';

import { getUserByEmail, userHasProviderAccount } from '@/queries/user';
import { sendPasswordResetEmail } from '@/lib/mail';
import { generatePasswordResetToken } from '@/lib/tokens';
import { resetPasswordSchema } from '@/schemas';
import { z } from 'zod';
import { getTranslations } from 'next-intl/server';

export async function resetPassword(
  values: z.infer<typeof resetPasswordSchema>,
) {
  const fields = resetPasswordSchema.safeParse(values);
  const t = await getTranslations('ServerErrors');
  if (!fields.success) return { error: t('inv_email') };

  const { email } = fields.data;
  const user = await getUserByEmail(email);
  if (!user) return { error: t('email_not_found') };

  const { value: isProviderAccount, provider } = await userHasProviderAccount(
    user.id,
  );

  if (isProviderAccount) {
    return {
      message: `${t('is_provider')} ${provider}.`,
    };
  }

  const passwordResetToken = await generatePasswordResetToken(email);
  if (passwordResetToken.currentToken) {
    return {
      message: `${t('already_has_a_token')} ${passwordResetToken?.currentToken?.expires.toLocaleTimeString()}, ${t('check_out')}`,
    };
  }
  if (passwordResetToken.newToken)
    await sendPasswordResetEmail(
      passwordResetToken.newToken.email,
      passwordResetToken.newToken.token,
    );
  return { success: t('email_sent') };
}
