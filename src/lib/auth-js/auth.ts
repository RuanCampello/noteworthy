import { createPlaceholderNote, registerWithProvider } from '@/actions';
import { env } from '@/env';
import authConfig from '@/lib/auth-js/auth.config';
import { registerWithProviderSchema } from '@/schemas';
import { jwtDecode } from 'jwt-decode';
import NextAuth, { type DefaultSession, User } from 'next-auth';

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
      await fetch(`${env.INK_HOSTNAME}/link-account/${user.id}`, {
        method: 'get',
      });
    },
    async createUser({ user }) {
      if (user.id) {
        await createPlaceholderNote(user.id);
      }
    },
  },
  callbacks: {
    async signIn({ account, user }) {
      const provider = account?.provider;
      if (account && (provider === 'google' || provider === 'github')) {
        const values = registerWithProviderSchema.parse({
          provider,
          providerAccountId: account.providerAccountId,
          expiresAt: account.expires_at,
          accessToken: account.access_token,
          scope: account.scope,
          idToken: account.id_token,
          email: user.email,
          name: user.name,
        });

        const id = await registerWithProvider(values);
        return Boolean(id);
      }

      return provider === 'credentials';
    },
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
        if (account.provider === 'credentials') {
          return { ...token, user: user };
        }

        const response = await fetch(`${env.INK_HOSTNAME}/authorize`, {
          method: 'post',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            id: account.providerAccountId,
            provider: account.provider,
          }),
        });

        const accessToken = await response.text();
        console.debug('Access token acquired with successAAAAAAAA');
        const claims: User = jwtDecode(accessToken);
        // @ts-expect-error undeclared type
        claims.accessToken = accessToken;
        token.user = claims;

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
