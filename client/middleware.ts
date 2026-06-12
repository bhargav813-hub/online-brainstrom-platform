import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const authRoutes = ['/login', '/register'];
const protectedPrefixes = ['/workspaces', '/profile'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for token in cookies or authorization header
  const token = request.cookies.get('brainstorm_access_token')?.value;

  const isAuthRoute = authRoutes.some((route) => pathname === route);
  const isProtectedRoute = protectedPrefixes.some((prefix) => pathname.startsWith(prefix));

  // Redirect authenticated users away from auth routes
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/workspaces', request.url));
  }

  // Note: We don't block protected routes in middleware because
  // the AuthProvider handles token refresh via localStorage.
  // The middleware can only read cookies, not localStorage.
  // Protection is handled client-side by AuthProvider + page guards.

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/register', '/workspaces/:path*', '/profile/:path*'],
};
