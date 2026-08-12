// service/auth.service.ts
import { apiClient } from '@/lib/api';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: string;  // Optional if backend doesn't require it
}

export const authService = {
  // ✅ Login - matches backend /auth/login
  login: async (data: LoginData) => {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  },

  // ✅ Register - matches backend /users/register
  register: async (data: RegisterData) => {
    const response = await apiClient.post('/users/register', data);
    return response.data;
  },

  // ✅ Refresh Token - matches backend /auth/refresh-token
  refreshToken: async (refreshToken: string) => {
    const response = await apiClient.post('/auth/refresh-token', { refreshToken });
    return response.data;
  },

  // ✅ Get Current User
  getMe: async () => {
    const response = await apiClient.get('/users/me');
    return response.data;
  },

  // ✅ Update Profile
  updateProfile: async (data: any) => {
    const response = await apiClient.patch('/users/me', data);
    return response.data;
  },
};