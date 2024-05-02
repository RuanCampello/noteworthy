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

      if (trigger === 'update' && session?.image) {
        //update database field
        await db.user.update({
          where: { id: user.id },
          data: { image: session.image },
        });
        return {
          //update current session image
          ...token,
          picture: session.image,
          id: user.id,
        };
      }
      return {
        ...token,
        id: user.id,
      };
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt' },
  ...authConfig,
});
