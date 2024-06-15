import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import authConfig from '@/auth.config';
import { getUserById } from '@/queries/user';
import { createPlaceholderNote } from '@/actions/note';
import { db } from '@/server/db';

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
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
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
          await db.user.update({
            data: { name: session.name },
            where: { id: user.id },
          });

          //update token with new data
          token.name = session.name;
          token.id = user.id;
        }
      }
      return token;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt' },
  ...authConfig,
});
