'use client';

import { useEffect } from 'react';

import { getMe } from '@/service/getMe';
import { useAuthStore } from '@/lib/auth';
import type { User } from '@/lib/auth';

type MeResult = {
  success?: boolean;
  data?: { profile?: User } | User;
};

// Rehydrates the auth store from the httpOnly session cookies on app mount.
// The session lives server-side; this only mirrors the profile for the UI.
export default function AuthSync() {
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    let active = true;

    getMe()
      .then((result: MeResult) => {
        if (!active) return;
        if (!result?.success) {
          setUser(null);
          return;
        }
        const data = result.data;
        const profile =
          data && 'profile' in data
            ? data.profile
            : data && 'role' in data
              ? (data as User)
              : null;
        setUser(profile && 'role' in profile ? profile : null);
      })
      .catch(() => {
        if (active) setUser(null);
      });

    return () => {
      active = false;
    };
  }, [setUser]);

  return null;
}
