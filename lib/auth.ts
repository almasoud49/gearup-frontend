import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'CUSTOMER' | 'PROVIDER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      // Called after successful login/register
      setAuth: (user, token) => {
        // Save token to localStorage for the API interceptor
        localStorage.setItem('accessToken', token);
        set({ user, token, isAuthenticated: true });
      },

      // Called when logging out
      logout: () => {
        localStorage.removeItem('accessToken');
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage', // key in localStorage
    }
  )
);