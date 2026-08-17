'use server';

import { getAccessToken } from '@/service/refreshToken';
import type { AdminStats, ApiResponse, User } from '@/lib/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface ActionResult {
  ok: boolean;
  error?: string;
}

export interface ProfileActionState {
  success?: boolean;
  field?: string;
  form?: string;
}

export const updateProfileAction = async (
  _prevState: ProfileActionState | null,
  formData: FormData
): Promise<ProfileActionState> => {
  const name = String(formData.get('name') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();

  if (!name) return { success: false, field: 'name', form: 'Name is required' };
  if (!/^\S+@\S+$/i.test(email)) return { success: false, field: 'email', form: 'Invalid email address' };

  const res = await fetch(`${API_BASE_URL}/users/me`, {
    method: 'PATCH',
    headers: { ...jsonHeaders, ...(await authHeaders()) },
    body: JSON.stringify({ name, email }),
  });

  if (!res.ok) {
    return { success: false, form: await getServerError(res, 'Could not update profile') };
  }
  return { success: true };
};

const jsonHeaders = { 'Content-Type': 'application/json' };

const authHeaders = async (): Promise<Record<string, string>> => {
  const token = await getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const getServerError = async (res: Response, fallback: string) => {
  try {
    const body = (await res.json()) as { message?: string; errorDetails?: { message?: string } };
    return body.message || body.errorDetails?.message || fallback;
  } catch {
    return fallback;
  }
};

export const getAdminUsers = async (): Promise<ApiResponse<User[]>> => {
  const res = await fetch(`${API_BASE_URL}/admin/users`, {
    headers: await authHeaders(),
    cache: 'no-store',
  });
  return res.json();
};

export const getAdminStats = async (): Promise<ApiResponse<AdminStats>> => {
  const res = await fetch(`${API_BASE_URL}/admin/stats`, {
    headers: await authHeaders(),
    cache: 'no-store',
  });
  return res.json();
};

// NOTE: the deployed backend has no admin user-update endpoint; conventional
// shape, surfaces backend error if unsupported.
export const updateUserStatusAction = async (
  id: string,
  isSuspended: boolean
): Promise<ActionResult> => {
  const res = await fetch(`${API_BASE_URL}/admin/users/${id}/suspend`, {
    method: 'PATCH',
    headers: { ...jsonHeaders, ...(await authHeaders()) },
    body: JSON.stringify({ isSuspended }),
  });

  if (!res.ok) {
    return { ok: false, error: await getServerError(res, 'Backend rejected the update') };
  }
  return { ok: true };
};
