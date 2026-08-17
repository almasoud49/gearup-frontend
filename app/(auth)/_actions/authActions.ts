'use server';

import jwt, { JwtPayload } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { ROLE_HOME, type UserRole } from '@/lib/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export type LoginState =
  | { success: true; redirectTo: string }
  | { success: false; email?: string; password?: string; form?: string };

export type RegisterState =
  | { success: true }
  | { success: false; name?: string; email?: string; password?: string; role?: string; form?: string };

type ApiResult = {
  success?: boolean;
  message?: string;
  data?: {
    accessToken?: string;
    refreshToken?: string;
  };
  errorDetails?: { message?: string };
};

const isSafeRedirect = (value: string) => value.startsWith('/') && !value.startsWith('//');

const getErrorMessage = (result: ApiResult, fallback: string) =>
  result?.message || result?.errorDetails?.message || fallback;

export const loginAction = async (
  redirectTo: string,
  _prevState: LoginState | null,
  formData: FormData
): Promise<LoginState> => {
  const email = String(formData.get('email') ?? '');
  const password = String(formData.get('password') ?? '');

  if (!email.trim()) return { success: false, email: 'Email is required' };
  if (!/^\S+@\S+$/i.test(email)) return { success: false, email: 'Invalid email address' };
  if (!password) return { success: false, password: 'Password is required' };

  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const result = (await res.json()) as ApiResult;

  if (result.success && result.data?.accessToken) {
    const cookieStore = await cookies();

    cookieStore.set('accessToken', result.data.accessToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 24,
      sameSite: 'lax',
    });
    if (result.data.refreshToken) {
      cookieStore.set('refreshToken', result.data.refreshToken, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7,
        sameSite: 'lax',
      });
    }

    const decoded = jwt.decode(result.data.accessToken) as JwtPayload | null;
    const role = decoded?.role as UserRole | undefined;

    if (isSafeRedirect(redirectTo)) redirect(redirectTo);
    redirect((role ? ROLE_HOME[role] : undefined) ?? '/');
  }

  return { success: false, form: getErrorMessage(result, 'Login failed. Please try again.') };
};

export const registerAction = async (
  _prevState: RegisterState | null,
  formData: FormData
): Promise<RegisterState> => {
  const name = String(formData.get('name') ?? '');
  const email = String(formData.get('email') ?? '');
  const password = String(formData.get('password') ?? '');
  const role = (formData.get('role') as 'CUSTOMER' | 'PROVIDER') || 'CUSTOMER';

  if (!name.trim()) return { success: false, name: 'Name is required' };
  if (name.length < 2) return { success: false, name: 'Name must be at least 2 characters' };
  if (!email.trim()) return { success: false, email: 'Email is required' };
  if (!/^\S+@\S+$/i.test(email)) return { success: false, email: 'Invalid email address' };
  if (!password) return { success: false, password: 'Password is required' };
  if (password.length < 6) return { success: false, password: 'Password must be at least 6 characters' };
  if (!role) return { success: false, role: 'Role is required' };

  const res = await fetch(`${API_BASE_URL}/users/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password, role }),
  });

  const result = (await res.json()) as ApiResult;

  if (result.success) return { success: true };

  return { success: false, form: getErrorMessage(result, 'Registration failed') };
};
