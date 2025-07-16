
// src/middleware.ts
import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const maintenanceCookie = request.cookies.get('maintenance_mode');

  // Paths that should always be accessible, even during maintenance.
  // This list must include the admin portal and the maintenance page itself.
  const isExemptPath =
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') || // Covers static, image, etc.
    pathname.includes('/favicon.ico') ||
    pathname.includes('.png') ||
    pathname.includes('.svg') ||
    pathname === '/maintenance';

  // If the maintenance cookie is set to 'true' and the path is not exempt,
  // rewrite the user to the maintenance page.
  if (maintenanceCookie?.value === 'true' && !isExemptPath) {
    return NextResponse.rewrite(new URL('/maintenance', request.url));
  }

  // Allow all other requests to proceed as normal.
  return NextResponse.next();
}

// We run this middleware on every request.
export const config = {
  matcher: '/((?!_next/static|_next/image|favicon.ico).*)',
};
