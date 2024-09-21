import { createPlaceholderNote } from '@/actions/note';
import authConfig from '@/auth/auth.config';
import { env } from '@/env';
import { db } from '@/server/db';
import { user as userTable } from '@/server/db/schema';
import { eq } from 'drizzle-orm';
import { jwtDecode } from 'jwt-decode';
import NextAuth, { type DefaultSession, User } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      accessToken?: string;
    } & DefaultSession['user'];
  }
}

const providers = ['github', 'google'];

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
        if (providers.includes(account.provider)) {
          const response = await fetch(`${env.INK_HOSTNAME}/authorize`, {
            method: 'post',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
              id: account.providerAccountId,
              provider: account.provider,
            }),
          });
          const accessToken = await response.text();
          const claims: User = jwtDecode(accessToken);
          // @ts-expect-error undeclared type
          claims.accessToken = accessToken;
          token.user = claims;
          return { ...token };
        }
        return { ...token, user: user };
      }
      // @ts-expect-error undeclared type
      if (Date.now() / 1000 > token.user.exp) {
        const response = await fetch(
          // @ts-expect-error undeclared type
          `${env.INK_HOSTNAME}/refresh-token/${token.user.accessToken}`,
          { method: 'get' },
        );
        const newToken = await response.json();
        const claims: User = jwtDecode(newToken);
        // @ts-expect-error undeclared type
        claims.accessToken = newToken;
        token.user = claims;
        return { ...token };
      }

      return token;
    },
  },
  session: { strategy: 'jwt' },
  ...authConfig,
});
