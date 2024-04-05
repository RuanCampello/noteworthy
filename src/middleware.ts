import { NextResponse } from 'next/server';
import {
  authRoutes,
  DEFAULT_REDIRECT,
  apiAuthPrefix,
  publicRoutes,
} from './routes';
import NextAuth from 'next-auth';
import authConfig from './auth.config';

const { auth } = NextAuth(authConfig);

export default auth((request) => {
  const { nextUrl } = request;
  const { pathname } = nextUrl;
  const isLoggedIn = request.auth;

  const isApiAuthRoute = pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(pathname);
  const isAuthRoute = authRoutes.includes(pathname);

  if (isApiAuthRoute) return undefined;

  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(DEFAULT_REDIRECT, nextUrl.origin));
    }
    return undefined;
  }

  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', nextUrl.origin));
  }
  return undefined;
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
