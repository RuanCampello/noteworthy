import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import authConfig from '@/auth.config';
import { db } from '@/db';
import { getUserById } from './data/user';
import { createPlaceholderNote } from './actions/note';

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

      const updates: Partial<{ name: string; image: string }> = {};

      if (trigger === 'update') {
        if (session?.name && session.name !== user.name) {
          updates.name = session.name;
        }
        if (session?.image && session.image !== user.image) {
          updates.image = session.image;
        }
        if (Object.keys(updates).length > 0) {
          await db.user.update({ data: updates, where: { id: user.id } });
          //update token with new data
          if (updates.name) {
            token.name = updates.name;
          }
          if (updates.image) {
            token.picture = updates.image;
          }
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
