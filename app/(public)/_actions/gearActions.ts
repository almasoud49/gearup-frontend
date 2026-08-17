'use server';

import type { ApiResponse, Category, GearItem } from '@/lib/types';
import type { GearQuery } from '@/lib/gear';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface GearListResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: GearItem[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

export const getAllGear = async (params?: GearQuery): Promise<GearListResponse> => {
  const search = new URLSearchParams();
  if (params?.page) search.set('page', String(params.page));
  if (params?.limit) search.set('limit', String(params.limit));
  if (params?.searchTerm) search.set('searchTerm', params.searchTerm);
  if (params?.brand) search.set('brand', params.brand);
  if (params?.categoryId) search.set('categoryId', params.categoryId);
  if (params?.minPrice) search.set('minPrice', String(params.minPrice));
  if (params?.maxPrice) search.set('maxPrice', String(params.maxPrice));
  if (params?.availability !== undefined) search.set('availability', String(params.availability));
  if (params?.sortBy) search.set('sortBy', params.sortBy);
  if (params?.sortOrder) search.set('sortOrder', params.sortOrder);

  const qs = search.toString();
  const res = await fetch(`${API_BASE_URL}/gear${qs ? `?${qs}` : ''}`, { cache: 'no-store' });
  return res.json();
};

export const getGearById = async (id: string): Promise<ApiResponse<GearItem>> => {
  const res = await fetch(`${API_BASE_URL}/gear/${id}`, { cache: 'no-store' });
  return res.json();
};

export const getCategories = async (): Promise<ApiResponse<Category[]>> => {
  const res = await fetch(`${API_BASE_URL}/categories`, { cache: 'no-store' });
  return res.json();
};
