// src/middleware.ts
import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const maintenanceCookie = request.cookies.get('maintenance_mode');

  // Paths that should always be accessible, even if the maintenance cookie is set.
  const isExemptPath =
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next/static') ||
    pathname.startsWith('/_next/image') ||
    pathname.startsWith('/images') ||
    pathname.endsWith('.png') ||
    pathname.endsWith('.ico') ||
    pathname.endsWith('.svg') ||
    pathname === '/maintenance';

  // If maintenance mode is active (cookie exists) and the path is not exempt,
  // rewrite to the maintenance page.
  if (maintenanceCookie && !isExemptPath) {
    return NextResponse.rewrite(new URL('/maintenance', request.url));
  }

  // Allow all other requests to proceed as normal.
  return NextResponse.next();
}

// Config to run the middleware on all paths except for specific asset types.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images/ (public image files)
     * This is a "negative lookahead" regex.
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images|.*\\.png$).*)',
  ],
};
