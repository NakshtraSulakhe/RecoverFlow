import { apiClient } from './client';
import { ApiResponse, AuthResponse, LoginCredentials, RegisterCredentials, User } from './types';
import { STORAGE_KEYS } from '../../utils/constants';

const TOKEN_KEY = STORAGE_KEYS.TOKEN;
const REFRESH_TOKEN_KEY = STORAGE_KEYS.REFRESH_TOKEN;
const USER_KEY = STORAGE_KEYS.USER;
const TENANT_ID_KEY = STORAGE_KEYS.TENANT_ID;
const REMEMBER_ME_KEY = 'remember_me';
const TOKEN_EXPIRY_KEY = 'token_expiry';

const getStorage = (rememberMe: boolean = false): Storage => {
  return rememberMe ? localStorage : sessionStorage;
};

// Helper to decode JWT and get expiry time
const getTokenExpiry = (token: string): number | null => {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return decoded.exp ? decoded.exp * 1000 : null;
  } catch {
    return null;
  }
};

// Check if token is expired or will expire soon (within 5 minutes)
const isTokenExpiringSoon = (token: string): boolean => {
  const expiry = getTokenExpiry(token);
  if (!expiry) return false;
  const now = Date.now();
  const fiveMinutes = 5 * 60 * 1000;
  return expiry - now < fiveMinutes;
};

export const authService = {
  async login(credentials: LoginCredentials, rememberMe: boolean = false) {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
    const { user, tenant, access_token, refresh_token } = response.data.data!;

    const storage = getStorage(rememberMe);
    
    storage.setItem(TOKEN_KEY, access_token);
    storage.setItem(REFRESH_TOKEN_KEY, refresh_token);
    storage.setItem(USER_KEY, JSON.stringify(user));
    storage.setItem(REMEMBER_ME_KEY, rememberMe.toString());
    
    // Store token expiry time
    const expiry = getTokenExpiry(access_token);
    if (expiry) {
      storage.setItem(TOKEN_EXPIRY_KEY, expiry.toString());
    }
    
    if (tenant?.id) {
      storage.setItem(TENANT_ID_KEY, tenant.id);
    }

    // Clear the other storage
    const otherStorage = getStorage(!rememberMe);
    otherStorage.removeItem(TOKEN_KEY);
    otherStorage.removeItem(REFRESH_TOKEN_KEY);
    otherStorage.removeItem(USER_KEY);
    otherStorage.removeItem(TENANT_ID_KEY);
    otherStorage.removeItem(REMEMBER_ME_KEY);
    otherStorage.removeItem(TOKEN_EXPIRY_KEY);

    return response.data;
  },

  async register(credentials: RegisterCredentials) {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', credentials);
    const { user, tenant, access_token, refresh_token } = response.data.data!;

    localStorage.setItem(TOKEN_KEY, access_token);
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh_token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    localStorage.setItem(TENANT_ID_KEY, tenant.id);

    const expiry = getTokenExpiry(access_token);
    if (expiry) {
      localStorage.setItem(TOKEN_EXPIRY_KEY, expiry.toString());
    }

    return response.data;
  },

  async logout() {
    try {
      await apiClient.post<ApiResponse>('/auth/logout');
    } catch (error) {
      // Ignore logout API errors
    } finally {
      // Clear both storages
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(TENANT_ID_KEY);
      localStorage.removeItem(REMEMBER_ME_KEY);
      localStorage.removeItem(TOKEN_EXPIRY_KEY);
      
      sessionStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(REFRESH_TOKEN_KEY);
      sessionStorage.removeItem(USER_KEY);
      sessionStorage.removeItem(TENANT_ID_KEY);
      sessionStorage.removeItem(REMEMBER_ME_KEY);
      sessionStorage.removeItem(TOKEN_EXPIRY_KEY);
    }
  },

  async getCurrentUser() {
    const response = await apiClient.get<ApiResponse<User>>('/auth/me');
    return response.data;
  },

  async refreshToken() {
    const storage = this.getStorageForToken();
    const refreshToken = storage?.getItem(REFRESH_TOKEN_KEY);
    
    if (!refreshToken || !storage) {
      throw new Error('No refresh token available');
    }

    const response = await apiClient.post<ApiResponse<{ access_token: string; expires_in: number }>>('/auth/refresh', {
      refresh_token: refreshToken,
    });
    
    const { access_token } = response.data.data!;
    storage.setItem(TOKEN_KEY, access_token);
    
    // Update token expiry
    const expiry = getTokenExpiry(access_token);
    if (expiry) {
      storage.setItem(TOKEN_EXPIRY_KEY, expiry.toString());
    }
    
    return response.data;
  },

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    // Check if token is expired
    const storage = this.getStorageForToken();
    const expiryStr = storage?.getItem(TOKEN_EXPIRY_KEY);
    if (expiryStr) {
      const expiry = parseInt(expiryStr, 10);
      const now = Date.now();
      if (expiry < now) {
        // Token expired, clear it
        this.clearExpiredToken();
        return false;
      }
    }
    
    return true;
  },

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
  },

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY) || sessionStorage.getItem(REFRESH_TOKEN_KEY);
  },

  getStorageForToken(): Storage | null {
    if (localStorage.getItem(TOKEN_KEY)) {
      return localStorage;
    }
    if (sessionStorage.getItem(TOKEN_KEY)) {
      return sessionStorage;
    }
    return null;
  },

  getCurrentUserFromStorage(): User | null {
    const userStr = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  },

  getTenantId(): string | null {
    return localStorage.getItem(TENANT_ID_KEY) || sessionStorage.getItem(TENANT_ID_KEY);
  },

  clearExpiredToken() {
    const storage = this.getStorageForToken();
    if (storage) {
      storage.removeItem(TOKEN_KEY);
      storage.removeItem(TOKEN_EXPIRY_KEY);
    }
  },

  shouldRefreshToken(): boolean {
    const token = this.getToken();
    if (!token) return false;
    return isTokenExpiringSoon(token);
  },
};
