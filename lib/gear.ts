import type { GearItem } from '@/lib/types';

export interface GearPayload {
  name: string;
  description: string;
  pricePerDay: number;
  brand: string;
  stockQuantity: number;
  availability: boolean;
  images: string[];
  categoryId: string;
  specifications: Record<string, string>;
}

export const DEFAULT_GEAR_PAYLOAD: GearPayload = {
  name: '',
  description: '',
  pricePerDay: 1,
  brand: '',
  stockQuantity: 1,
  availability: true,
  images: [],
  categoryId: '',
  specifications: {},
};

export interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt?: string;
  customer?: { id: string; name: string };
}

export interface GearQuery {
  page?: number;
  limit?: number;
  searchTerm?: string;
  brand?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  availability?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface GearListResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: GearItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}