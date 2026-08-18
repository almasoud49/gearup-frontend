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

export const getAdminUsers = async (params?: {
  role?: string;
  searchTerm?: string;
  isSuspended?: boolean;
}): Promise<ApiResponse<User[]>> => {
  const qs = new URLSearchParams();
  if (params?.role) qs.set('role', params.role);
  if (params?.searchTerm) qs.set('searchTerm', params.searchTerm);
  if (params?.isSuspended !== undefined) qs.set('isSuspended', String(params.isSuspended));
  const query = qs.toString();

  const res = await fetch(`${API_BASE_URL}/admin/users${query ? `?${query}` : ''}`, {
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

export const updateUserRoleAction = async (
  id: string,
  role: 'CUSTOMER' | 'PROVIDER'
): Promise<ActionResult> => {
  const res = await fetch(`${API_BASE_URL}/admin/users/${id}/role`, {
    method: 'PATCH',
    headers: { ...jsonHeaders, ...(await authHeaders()) },
    body: JSON.stringify({ role }),
  });

  if (!res.ok) {
    return { ok: false, error: await getServerError(res, 'Backend rejected the update') };
  }
  return { ok: true };
};

export const deleteUserAction = async (id: string): Promise<ActionResult> => {
  const res = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
    method: 'DELETE',
    headers: await authHeaders(),
  });

  if (!res.ok) {
    return { ok: false, error: await getServerError(res, 'Backend rejected the deletion') };
  }
  return { ok: true };
};
