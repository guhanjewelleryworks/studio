// src/middleware.ts
import { NextResponse, type NextRequest } from 'next/server';
import { fetchPlatformSettings } from '@/actions/settings-actions';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Paths that should always be accessible, even in maintenance mode.
  // This includes the maintenance page itself, admin portal, API routes, and static assets.
  const isExemptPath =
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next/static') ||
    pathname.startsWith('/_next/image') ||
    pathname.startsWith('/images') || // Allow access to public images
    pathname.endsWith('.png') ||
    pathname.endsWith('.ico') ||
    pathname.endsWith('.svg') ||
    pathname === '/maintenance';

  if (isExemptPath) {
    return NextResponse.next();
  }
  
  try {
    // Fetch settings directly. This action runs on the server, so it's efficient.
    const settings = await fetchPlatformSettings();

    if (settings.isMaintenanceModeEnabled) {
      // The user is not on an exempt path and maintenance mode is ON.
      // Rewrite the URL to the maintenance page.
      // Using rewrite is better than redirect as it keeps the original URL in the address bar.
      console.log(`[Middleware] Maintenance mode is ON. Rewriting ${pathname} to /maintenance.`);
      return NextResponse.rewrite(new URL('/maintenance', request.url));
    }
  } catch (error) {
    // If fetching settings fails, it's safer to let the site function
    // rather than locking everyone out. Log the error for debugging.
    console.error('[Middleware] Failed to fetch settings, allowing request to proceed:', error);
  }

  // If maintenance mode is off or there was an error, proceed as normal.
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
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
