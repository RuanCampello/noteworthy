import { createPlaceholderNote } from '@/actions/note';
import authConfig from '@/auth/auth.config';
import { db } from '@/server/db';
import { user as userTable } from '@/server/db/schema';
import { eq } from 'drizzle-orm';
import NextAuth, { type DefaultSession } from 'next-auth';
import {} from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      accessToken?: string;
    } & DefaultSession['user'];
  }
}

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
      // @ts-expect-error undeclared type
      if (session.user && token.user.id) {
        // @ts-expect-error undeclared type
        session.user = token.user;
        // @ts-expect-error undeclared type
        session.user.accessToken = token.user.accessToken;
      }
      return session;
    },
    async jwt({ token, user, account }) {
      if (user && account) {
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
