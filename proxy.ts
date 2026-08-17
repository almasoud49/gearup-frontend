import type { JwtPayload } from 'jsonwebtoken';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { jwtUtils } from './utils/jwt';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const ROLE_HOME: Record<string, string> = {
  CUSTOMER: '/customer',
  PROVIDER: '/provider',
  ADMIN: '/admin',
};

const AUTH_PATHS = ['/login', '/register'];

const FLOW_PATHS = ['/checkout', '/payment'];

const ACCESS_COOKIE_MAX_AGE = 60 * 60 * 24; // 1 day

// The backend reads the refresh token from the request cookies.
const refreshAccessToken = async (refreshToken: string) => {
  const res = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
    method: 'POST',
    headers: {
      Cookie: `refreshToken=${refreshToken}`,
    },
    cache: 'no-cache',
  });

  return res.json();
};

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessTokenCookie = request.cookies.get('accessToken')?.value;
  const refreshTokenCookie = request.cookies.get('refreshToken')?.value;

  let accessToken = accessTokenCookie ?? null;

  let decodedAccessToken = accessToken
    ? jwtUtils.verifyToken(accessToken, process.env.JWT_ACCESS_SECRET as string)
    : null;

  const decodedRefreshToken = refreshTokenCookie
    ? jwtUtils.verifyToken(refreshTokenCookie, process.env.JWT_REFRESH_SECRET as string)
    : null;

  // Access token expired but refresh token is still valid — rotate it.
  let refreshedToken: string | null = null;

  if (!decodedAccessToken?.success && decodedRefreshToken?.success && refreshTokenCookie) {
    const result = await refreshAccessToken(refreshTokenCookie);

    if (result.success && result.data.accessToken) {
      refreshedToken = result.data.accessToken as string;
      accessToken = refreshedToken;
      decodedAccessToken = jwtUtils.verifyToken(
        refreshedToken,
        process.env.JWT_ACCESS_SECRET as string
      );
    }
  }

  const userRole = decodedAccessToken?.success
    ? (decodedAccessToken.data as JwtPayload).role
    : null;

  const withCookie = (response: NextResponse) => {
    if (refreshedToken) {
      response.cookies.set('accessToken', refreshedToken, {
        httpOnly: true,
        maxAge: ACCESS_COOKIE_MAX_AGE,
        sameSite: 'lax',
      });
    }
    return response;
  };

  // Logged-in user visiting a public auth page → role home.
  if (AUTH_PATHS.includes(pathname)) {
    if (accessToken && userRole) {
      return withCookie(NextResponse.redirect(new URL(ROLE_HOME[userRole] ?? '/', request.url)));
    }
    return withCookie(NextResponse.next());
  }

  // Unauthenticated → login, remembering where the user was headed.
  if (!accessToken) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirectTo', pathname);
    return withCookie(NextResponse.redirect(url));
  }

  // Shared flow paths are reachable by any logged-in role.
  const isFlowPath = FLOW_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  if (isFlowPath) return withCookie(NextResponse.next());

  // Role-based access control: the path must belong to the user's role home.
  const home = ROLE_HOME[userRole ?? ''];
  const allowed = home && (pathname === home || pathname.startsWith(`${home}/`));
  if (!allowed) {
    return withCookie(NextResponse.redirect(new URL(home ?? '/', request.url)));
  }

  return withCookie(NextResponse.next());
}

export const config = {
  matcher: [
    '/login',
    '/register',
    '/checkout',
    '/payment/:path*',
    '/customer/:path*',
    '/provider/:path*',
    '/admin/:path*',
  ],
};
