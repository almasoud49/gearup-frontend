import { create } from 'zustand';

export type UserRole = 'CUSTOMER' | 'PROVIDER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isSuspended: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const ROLE_HOME: Record<UserRole, string> = {
  CUSTOMER: '/customer',
  PROVIDER: '/provider',
  ADMIN: '/admin',
};

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}


export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));
