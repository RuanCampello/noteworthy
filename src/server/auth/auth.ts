import { createPlaceholderNote } from '@/actions/note';
import authConfig from '@/auth/auth.config';
import { db } from '@/server/db';
import { user as userTable } from '@/server/db/schema';
import { eq } from 'drizzle-orm';
import NextAuth from 'next-auth';

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
      if (session.user && (token.user as { id: string }).id) {
        console.log('session', session);
        console.log('token', token);

        // @ts-expect-error need to type the user on module
        session.user = token.user;
      }
      return session;
    },
    async jwt({ token, user, account }) {
      if (user && account) {
        console.log(user, account);
        return { ...token, user: user };
      }

      if (Date.now() < (token as { exp: number }).exp) {
        return token;
      }

      return token;
    },
  },
  session: { strategy: 'jwt' },
  ...authConfig,
});
