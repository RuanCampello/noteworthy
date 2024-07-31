import 'server-only';

import { drizzle as db } from '@/server/db';
import { eq } from 'drizzle-orm';
import { accounts, users } from '@/server/db/schema';

export async function getUserByEmail(email: string) {
  try {
    return await db.query.users.findFirst({
      where: eq(users.email, email),
    });
  } catch (error) {
    return null;
  }
}

export async function getUserById(id: string) {
  try {
    return await db.query.users.findFirst({
      where: eq(users.id, id),
    });
  } catch (error) {
    return null;
  }
}

export async function userHasProviderAccount(
  id: string,
): Promise<{ value: boolean; provider?: string }> {
  const response = await db.query.accounts.findFirst({
    where: eq(accounts.userId, id),
    columns: {
      provider: true,
    },
  });
  if (response?.provider) {
    return { value: true, provider: response.provider };
  }
  return { value: false };
}
