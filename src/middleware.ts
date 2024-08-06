import authConfig from '@/auth/auth.config';
import NextAuth from 'next-auth';
import { NextResponse } from 'next/server';
import {
  apiAuthPrefix,
  authRoutes,
  DEFAULT_REDIRECT,
  publicRoutes,
} from './routes';

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

  //default middleware return
  const requestHeaders = request.headers;
  requestHeaders.set('pathname', pathname);
  requestHeaders.set('search-params', nextUrl.searchParams.toString());
  return NextResponse.next({
    request: { headers: requestHeaders },
  });
});

export const config = {
  matcher:
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
};
