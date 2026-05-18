// src/api/auth.api.ts
import { axiosInstance } from './axios';
import { ApiResponse, User } from '@/types';

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: 'admin' | 'sales';
}

interface AuthData {
  token: string;
  user: User;
}

export const authApi = {
  login: (payload: LoginPayload) =>
    axiosInstance.post<ApiResponse<AuthData>>('/auth/login', payload),

  register: (payload: RegisterPayload) =>
    axiosInstance.post<ApiResponse<AuthData>>('/auth/register', payload),

  getMe: () =>
    axiosInstance.get<ApiResponse<User>>('/auth/me'),
};
