import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';

import type { NextAuthConfig } from 'next-auth';
import { loginFormSchema } from '@/schemas';
import { getUserByEmail } from './server/queries/user';
import bcrypt from 'bcryptjs';
import { env } from './env';

export default {
  secret: env.AUTH_SECRET,
  providers: [
    GitHub({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    }),
    Google({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      async authorize(credentials) {
        const fields = loginFormSchema.safeParse(credentials);

        if (fields.success) {
          const { email, password } = fields.data;
          const user = await getUserByEmail(email);
          if (!user || !user.password) return null;
          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (passwordsMatch) return user;
        }
        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
