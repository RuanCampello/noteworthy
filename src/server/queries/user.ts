import 'server-only';

import { drizzle as db } from '@/server/db';
import { account, user } from '@/server/db/schema';
import { eq } from 'drizzle-orm';

export async function getUserByEmail(email: string) {
  try {
    return await db.query.user.findFirst({
      where: eq(user.email, email),
    });
  } catch (error) {
    return null;
  }
}

export async function getUserById(id: string) {
  try {
    return await db.query.user.findFirst({
      where: eq(user.id, id),
    });
  } catch (error) {
    return null;
  }
}

export async function userHasProviderAccount(
  id: string,
): Promise<{ value: boolean; provider?: string }> {
  const response = await db.query.account.findFirst({
    where: eq(account.userId, id),
    columns: {
      provider: true,
    },
  });
  if (response?.provider) {
    return { value: true, provider: response.provider };
  }
  return { value: false };
}
