import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Look for the auth_token cookie set by our Go server
  const token = request.cookies.get('auth_token');

  // If the user doesn't have the token, redirect them to the login page
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // If they have the token, let them proceed to the resources page
  return NextResponse.next();
}

// Ensure this check only runs on the resources page to keep the rest of the site fast
export const config = {
  matcher: ['/resources/:path*'],
};