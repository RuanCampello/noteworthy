import NextAuth from 'next-auth';
import authConfig from '@/auth/auth.config';
import { getUserById } from '@/queries/user';
import { createPlaceholderNote } from '@/actions/note';
import { drizzle as db } from '@/server/db';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { eq } from 'drizzle-orm';
import { account as accountTable, user as userTable } from '@/server/db/schema';
import type { Adapter } from 'next-auth/adapters';

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: '/login',
    error: '/error',
  },
  events: {
    async linkAccount({ user }) {
      if (!user.id) return;
      await db
        .update(userTable)
        .set({
          emailVerified: new Date(),
        })
        .where(eq(userTable.id, user.id));
    },
    async createUser({ user }) {
      if (user.id) {
        await createPlaceholderNote(user.id);
      }
    },
  },
  callbacks: {
    async session({ token, session }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, session, trigger }) {
      if (!token.sub) return token;

      const user = await getUserById(token.sub);
      if (!user) return token;

      if (trigger === 'update') {
        if (session?.name && session.name !== user.name) {
          await db
            .update(userTable)
            .set({
              name: session.name,
            })
            .where(eq(userTable.id, user.id));

          //update token with new data
          token.name = session.name;
          token.id = user.id;
        }
      }
      return token;
    },
  },
  adapter: DrizzleAdapter(db, {
    usersTable: userTable,
    accountsTable: accountTable,
  }) as Adapter,
  session: { strategy: 'jwt' },
  ...authConfig,
});
