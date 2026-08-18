'use server';

import { getAccessToken } from '@/service/refreshToken';
import type { ApiResponse, Payment, ProviderStats, RentalOrder, RentalStatus, Review } from '@/lib/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface ActionResult {
  ok: boolean;
  error?: string;
}

export interface ReviewActionState {
  error: string | null;
  submitted?: boolean;
}

export interface RentalListResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: RentalOrder[];
  meta: { page: number; limit: number; total: number; totalPages: number };
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

export const getRentals = async (params?: { page?: number; limit?: number }): Promise<RentalListResponse> => {
  const search = new URLSearchParams();
  if (params?.page) search.set('page', String(params.page));
  if (params?.limit) search.set('limit', String(params.limit));
  const qs = search.toString();

  const res = await fetch(`${API_BASE_URL}/rentals${qs ? `?${qs}` : ''}`, {
    headers: await authHeaders(),
    cache: 'no-store',
  });
  return res.json();
};

export const getMyPayments = async (): Promise<ApiResponse<Payment[]>> => {
  const res = await fetch(`${API_BASE_URL}/payments`, {
    headers: await authHeaders(),
    cache: 'no-store',
  });
  return res.json();
};

export const getMyReviews = async (customerId: string): Promise<ApiResponse<Review[]>> => {
  const qs = new URLSearchParams({ customerId, limit: '100' });
  const res = await fetch(`${API_BASE_URL}/reviews?${qs.toString()}`, {
    headers: await authHeaders(),
    cache: 'no-store',
  });
  return res.json();
};

export const getProviderStats = async (): Promise<ApiResponse<ProviderStats>> => {
  const res = await fetch(`${API_BASE_URL}/provider/stats`, {
    headers: await authHeaders(),
    cache: 'no-store',
  });
  return res.json();
};

export const updateRentalStatusAction = async (
  id: string,
  status: RentalStatus
): Promise<ActionResult> => {
  const res = await fetch(`${API_BASE_URL}/rentals/${id}/status`, {
    method: 'PATCH',
    headers: { ...jsonHeaders, ...(await authHeaders()) },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    if (res.status === 404) {
      return {
        ok: false,
        error: 'Status updates are not supported by this backend yet.',
      };
    }
    return { ok: false, error: await getServerError(res, 'Backend rejected the status change.') };
  }
  return { ok: true };
};

export const cancelRentalAction = async (id: string): Promise<ActionResult> => {
  const res = await fetch(`${API_BASE_URL}/rentals/${id}/cancel`, {
    method: 'PATCH',
    headers: { ...jsonHeaders, ...(await authHeaders()) },
  });

  if (!res.ok) {
    if (res.status === 404) {
      return {
        ok: false,
        error: 'Cancellation is not supported by this backend yet.',
      };
    }
    return { ok: false, error: await getServerError(res, 'Could not cancel the order.') };
  }
  return { ok: true };
};

export const createReviewAction = async (
  gearItemId: string,
  _prevState: ReviewActionState | null,
  formData: FormData
): Promise<ReviewActionState> => {
  const comment = String(formData.get('comment') ?? '');
  const rating = Number(formData.get('rating') ?? 5);

  const res = await fetch(`${API_BASE_URL}/reviews`, {
    method: 'POST',
    headers: { ...jsonHeaders, ...(await authHeaders()) },
    body: JSON.stringify({ gearItemId, rating, comment }),
  });

  if (!res.ok) {
    return { error: await getServerError(res, 'Could not submit review') };
  }
  return { error: null, submitted: true };
};

export const updateReviewAction = async (
  reviewId: string,
  _prevState: ReviewActionState | null,
  formData: FormData
): Promise<ReviewActionState> => {
  const comment = String(formData.get('comment') ?? '');
  const rating = Number(formData.get('rating') ?? 5);

  const res = await fetch(`${API_BASE_URL}/reviews/${reviewId}`, {
    method: 'PUT',
    headers: { ...jsonHeaders, ...(await authHeaders()) },
    body: JSON.stringify({ rating, comment }),
  });

  if (!res.ok) {
    return { error: await getServerError(res, 'Could not update review') };
  }
  return { error: null, submitted: true };
};

export const deleteReviewAction = async (reviewId: string): Promise<ActionResult> => {
  const res = await fetch(`${API_BASE_URL}/reviews/${reviewId}`, {
    method: 'DELETE',
    headers: await authHeaders(),
  });

  if (!res.ok) {
    return { ok: false, error: await getServerError(res, 'Could not delete review') };
  }
  return { ok: true };
};
