'use server';

import { getAccessToken } from './refreshToken';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const getMe = async () => {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    return {
      success: false,
      message: 'User not logged in!',
    };
  }

  const res = await fetch(`${API_BASE_URL}/users/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: 'no-store',
  });

  const result = await res.json();

  return result;
};
