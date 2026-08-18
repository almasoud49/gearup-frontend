// types/index.ts
import type { Home01Icon } from '@hugeicons/core-free-icons';

export interface ISidebarItem {
  label: string;
  href: string;
  icon: typeof Home01Icon;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'CUSTOMER' | 'PROVIDER' | 'ADMIN';
  isSuspended: boolean;
  createdAt?: string;
  updatedAt?: string;
  _count?: { gearItems?: number; rentalOrders?: number; reviews?: number };
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
  specifications: Record<string, unknown>;
  categoryId: string;
  providerId: string;
  averageRating?: number;
  totalReviews?: number;
  provider?: { id: string; name: string; email: string };
  category?: Category;
  reviews?: GearReview[];
  _count?: { reviews: number };
  isDeleted?: boolean;
  deletedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface GearReview {
  id?: string;
  rating: number;
  comment: string;
  createdAt?: string;
  customer?: { id: string; name: string };
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  isDeleted: boolean;
  createdAt: string;
  customer?: { id: string; name: string; email: string };
  gearItem?: GearItem;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type RentalStatus =
  | 'PLACED'
  | 'CONFIRMED'
  | 'PAID'
  | 'PICKED_UP'
  | 'RETURNED'
  | 'CANCELLED';

export interface RentalOrder {
  id: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: RentalStatus;
  customerId: string;
  gearItemId: string;
  gearItem?: GearItem;
  customer?: User;
  payment?: Record<string, unknown> | Payment;
  review?: Record<string, unknown> | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Payment {
  id: string;
  transactionId: string;
  amount: number;
  method: string;
  status: string;
  paidAt: string | null;
  rentalOrderId?: string;
  rentalOrder?: RentalOrder;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaymentIntentResult {
  clientSecret: string;
  transactionId: string;
  amount: number;
  status: string;
}

export interface AdminStats {
  totalUsers: number;
  totalProviders: number;
  totalCustomers: number;
  totalGear: number;
  totalRentals: number;
  totalRevenue: number;
  pendingRentals: number;
  activeRentals: number;
  completedRentals: number;
}

export interface ProviderStats {
  totalGear: number;
  availableGear: number;
  unavailableGear: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
}

export interface RentalStatsOverview {
  total: number;
  placed: number;
  confirmed: number;
  paid: number;
  pickedUp: number;
  returned: number;
  cancelled: number;
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