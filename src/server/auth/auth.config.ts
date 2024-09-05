import { jwtDecode } from 'jwt-decode';
import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';

import { env } from '@/env';
import { loginFormSchema } from '@/schemas';
import { User } from 'next-auth';

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
        if (!fields.success) return null;

        const response = await fetch('http://localhost:6969/login', {
          method: 'POST',
          headers: { 'Content-type': 'application/json' },
          body: JSON.stringify({
            email: fields.data.email,
            password: fields.data.password,
          }),
        });
        const token = await response.json();
        const claims: User = jwtDecode(token);

        return claims;
      },
    }),
  ],
} satisfies NextAuthConfig;
