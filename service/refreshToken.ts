'use server';

import { cookies } from 'next/headers';

import { jwtUtils } from '@/utils/jwt';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const getNewAccessToken = async () => {
  const cookieStore = await cookies();

  const refreshToken = cookieStore.get('refreshToken')?.value || null;

  if (!refreshToken) {
    return {
      success: false,
      message: 'Refresh token not found!',
    };
  }

  // The backend reads the refresh token from the request cookies.
  const res = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
    method: 'POST',
    headers: {
      Cookie: `refreshToken=${refreshToken}`,
    },
    cache: 'no-cache',
  });

  const result = await res.json();

  return result;
};

// Returns a valid access token, refreshing it from the backend when it has
// expired (and persisting the fresh token to the httpOnly cookie).
export const getAccessToken = async () => {
  const cookieStore = await cookies();

  let accessToken = cookieStore.get('accessToken')?.value || null;
  const refreshToken = cookieStore.get('refreshToken')?.value || null;

  if (!accessToken && !refreshToken) {
    return null;
  }

  const decodedAccessToken = accessToken
    ? jwtUtils.verifyToken(accessToken, process.env.JWT_ACCESS_SECRET as string)
    : null;

  const decodedRefreshToken = refreshToken
    ? jwtUtils.verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET as string)
    : null;

  if (!decodedAccessToken?.success && decodedRefreshToken?.success) {
    const result = await getNewAccessToken();

    if (result.success) {
      const newAccessToken = result.data.accessToken;

      cookieStore.set('accessToken', newAccessToken, {
        httpOnly: true,
        maxAge: 60 * 60 * 24,
        sameSite: 'lax',
      });

      accessToken = newAccessToken;
    } else {
      return null;
    }
  }

  return accessToken;
};
