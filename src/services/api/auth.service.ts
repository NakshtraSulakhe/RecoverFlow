import { apiClient } from './client';
import { ApiResponse, AuthResponse, LoginCredentials, RegisterCredentials, User } from './types';

export const authService = {
  async login(credentials: LoginCredentials) {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
    const { user, tenant, access_token, refresh_token } = response.data.data!;

    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
    localStorage.setItem('tenant_id', tenant.id);
    localStorage.setItem('user', JSON.stringify(user));

    return response.data;
  },

  async register(credentials: RegisterCredentials) {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', credentials);
    const { user, tenant, access_token, refresh_token } = response.data.data!;

    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
    localStorage.setItem('tenant_id', tenant.id);
    localStorage.setItem('user', JSON.stringify(user));

    return response.data;
  },

  async logout() {
    try {
      await apiClient.post<ApiResponse>('/auth/logout');
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('tenant_id');
      localStorage.removeItem('user');
    }
  },

  async getCurrentUser() {
    const response = await apiClient.get<ApiResponse<User>>('/auth/me');
    return response.data;
  },

  async refreshToken(refreshToken: string) {
    const response = await apiClient.post<ApiResponse<{ access_token: string; expires_in: number }>>('/auth/refresh', {
      refresh_token: refreshToken,
    });
    return response.data;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  },

  getCurrentUserFromStorage(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
};
