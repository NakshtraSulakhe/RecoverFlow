import { STORAGE_KEYS } from './constants';

/**
 * Get the authentication token from storage
 */
export const getAuthToken = (): string | null => {
  const rememberMe = localStorage.getItem('remember_me') === 'true';
  const storage = rememberMe ? localStorage : sessionStorage;
  return storage.getItem(STORAGE_KEYS.TOKEN);
};

/**
 * Authenticated fetch wrapper that automatically includes the JWT token
 */
export const authFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const token = getAuthToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return fetch(url, {
    ...options,
    headers,
  });
};
