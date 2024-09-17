import { env } from '@/env';
import { loginFormSchema } from '@/schemas';
import { AccessDenied, CredentialsSignin } from '@auth/core/errors';
import { jwtDecode } from 'jwt-decode';
import { NextAuthConfig, User } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';

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
        'use server';
        const fields = loginFormSchema.safeParse(credentials);
        if (!fields.success) return null;
        const response = await fetch(`${env.INK_HOSTNAME}/login`, {
          method: 'POST',
          headers: { 'Content-type': 'application/json' },
          body: JSON.stringify({
            email: fields.data.email,
            password: fields.data.password,
          }),
        });
        switch (response.status) {
          case 400:
            throw new CredentialsSignin('');
          case 404:
            throw new AccessDenied('');
        }
        const token = await response.json();
        const claims: User = jwtDecode(token);

        return { ...claims, accessToken: token };
      },
    }),
  ],
} satisfies NextAuthConfig;
