// types/index.ts
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'CUSTOMER' | 'PROVIDER' | 'ADMIN';
  isSuspended: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface GearItem {
  id: string;
  name: string;
  description: string;
  pricePerDay: number;
  brand: string;
  availability: boolean;
  stockQuantity: number;
  images: string[];
  specifications: any;
  categoryId: string;
  providerId: string;
  averageRating?: number;
  totalReviews?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RentalOrder {
  id: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: 'PLACED' | 'CONFIRMED' | 'PAID' | 'PICKED_UP' | 'RETURNED' | 'CANCELLED';
  customerId: string;
  gearItemId: string;
  gearItem?: GearItem;
  customer?: User;
  payment?: any;
  review?: any;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}