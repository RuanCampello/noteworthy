import { NextRequest, NextResponse } from 'next/server';

export default function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('pathname', request.nextUrl.pathname);
  requestHeaders.set('search-params', request.nextUrl.searchParams.toString());
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}
