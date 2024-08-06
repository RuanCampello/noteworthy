import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';

import { env } from '@/env';
import { getUserByEmail } from '@/queries/user';
import { loginFormSchema } from '@/schemas';
import bcrypt from 'bcryptjs';

const isProd = process.env.NODE_ENV === 'production';

const providers = isProd
  ? [
      GitHub({
        clientId: env.GITHUB_CLIENT_ID,
        clientSecret: env.GITHUB_CLIENT_SECRET,
      }),
      Google({
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
      }),
    ]
  : [];

export default {
  secret: env.AUTH_SECRET,
  providers: [
    ...providers,
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
