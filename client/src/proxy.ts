import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicPaths = ['/', '/login', '/register', '/verify-otp', '/forgot-password', '/reset-password'];
const sharedPathPrefix = '/shared/';

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public pages and shared board viewer
  if (publicPaths.includes(pathname) || pathname.startsWith(sharedPathPrefix)) {
    return NextResponse.next();
  }

  // Allow static files, API routes, and Next.js internal paths
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') // static files
  ) {
    return NextResponse.next();
  }

  // For protected routes — middleware can't check sessionStorage (client-side only).
  // The actual auth guard is handled by the dashboard layout component.
  // Middleware ensures consistent response headers.
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
