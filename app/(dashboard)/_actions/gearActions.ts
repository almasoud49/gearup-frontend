'use server';

import { getAccessToken } from '@/service/refreshToken';
import { DEFAULT_GEAR_PAYLOAD, type GearPayload } from '@/lib/gear';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface ActionResult {
  ok: boolean;
  error?: string;
}

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

function parseImages(text: string): string[] {
  return text
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseSpecifications(text: string): Record<string, string> {
  return Object.fromEntries(
    text
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const idx = line.indexOf(':');
        const key = idx >= 0 ? line.slice(0, idx).trim() : line;
        const value = idx >= 0 ? line.slice(idx + 1).trim() : '';
        return [key, value] as [string, string];
      })
  );
}

export const saveGearAction = async (input: {
  id?: string;
  form: GearPayload;
  imagesText: string;
  specificationsText: string;
  categoryId: string;
}): Promise<ActionResult> => {
  const payload: GearPayload = {
    ...DEFAULT_GEAR_PAYLOAD,
    ...input.form,
    images: parseImages(input.imagesText),
    specifications: parseSpecifications(input.specificationsText),
    categoryId: input.categoryId,
  };

  const headers = { ...jsonHeaders, ...(await authHeaders()) };

  const res = input.id
    ? await fetch(`${API_BASE_URL}/gear/${input.id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(payload),
      })
    : await fetch(`${API_BASE_URL}/gear`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

  if (!res.ok) return { ok: false, error: await getServerError(res, 'Failed to save gear') };
  return { ok: true };
};

export const deleteGearAction = async (id: string): Promise<ActionResult> => {
  const res = await fetch(`${API_BASE_URL}/gear/${id}`, {
    method: 'DELETE',
    headers: await authHeaders(),
  });

  if (!res.ok) return { ok: false, error: await getServerError(res, 'Could not delete gear') };
  return { ok: true };
};
