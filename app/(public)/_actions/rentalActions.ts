'use server';

import { getAccessToken } from '@/service/refreshToken';
import type { ApiResponse, PaymentIntentResult, RentalOrder, RentalStatsOverview, Review } from '@/lib/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface ActionResult {
  ok: boolean;
  error?: string;
}

export interface CreateRentalResult extends ActionResult {
  order?: RentalOrder;
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

export const getRentalById = async (id: string): Promise<ApiResponse<RentalOrder>> => {
  const res = await fetch(`${API_BASE_URL}/rentals/${id}`, {
    headers: await authHeaders(),
    cache: 'no-store',
  });
  return res.json();
};

export const getRentalStatsOverview = async (): Promise<ApiResponse<RentalStatsOverview>> => {
  const res = await fetch(`${API_BASE_URL}/rentals/stats/overview`, {
    headers: await authHeaders(),
    cache: 'no-store',
  });
  return res.json();
};

export const getReviews = async (params?: { page?: number; limit?: number }): Promise<ApiResponse<Review[]>> => {
  const search = new URLSearchParams();
  if (params?.page) search.set('page', String(params.page));
  if (params?.limit) search.set('limit', String(params.limit));
  const qs = search.toString();

  const res = await fetch(`${API_BASE_URL}/reviews${qs ? `?${qs}` : ''}`, {
    cache: 'no-store',
  });
  return res.json();
};

export const createRentalAction = async (input: {
  gearItemId: string;
  startDate: string;
  endDate: string;
}): Promise<CreateRentalResult> => {
  const res = await fetch(`${API_BASE_URL}/rentals`, {
    method: 'POST',
    headers: { ...jsonHeaders, ...(await authHeaders()) },
    body: JSON.stringify({
      gearItemId: input.gearItemId,
      startDate: new Date(`${input.startDate}T00:00:00Z`).toISOString(),
      endDate: new Date(`${input.endDate}T00:00:00Z`).toISOString(),
    }),
  });

  if (!res.ok) {
    return { ok: false, error: await getServerError(res, 'Could not place the order. Please try again.') };
  }

  const result = (await res.json()) as ApiResponse<RentalOrder>;
  return { ok: true, order: result.data };
};

export const createPaymentIntent = async (
  rentalOrderId: string
): Promise<ApiResponse<PaymentIntentResult>> => {
  const res = await fetch(`${API_BASE_URL}/payments/create`, {
    method: 'POST',
    headers: { ...jsonHeaders, ...(await authHeaders()) },
    body: JSON.stringify({ rentalOrderId }),
  });
  return res.json();
};
