import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth_token')?.value;
  const isValidToken = Boolean(token && token !== 'undefined' && token !== 'null');
  const userRole = request.cookies.get('user_role')?.value;

  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register');
  const isAdminPage = pathname.startsWith('/admin');
  const isProtectedPage =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/chat') ||
    pathname.startsWith('/documents') ||
    pathname.startsWith('/profile') ||
    isAdminPage;

  // 1. If user is logged in and navigates to login/register, redirect to dashboard
  if (isAuthPage && isValidToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // 2. If user is NOT logged in and tries to access protected page, redirect to login
  if (isProtectedPage && !isValidToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 3. RBAC: If user tries to access admin pages but is not an admin, redirect to dashboard
  if (isAdminPage && userRole !== 'admin') {
    const dashboardUrl = new URL('/dashboard', request.url);
    dashboardUrl.searchParams.set('error', 'unauthorized');
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/login',
    '/register',
    '/dashboard/:path*',
    '/chat/:path*',
    '/documents/:path*',
    '/profile/:path*',
    '/admin/:path*',
  ],
};
