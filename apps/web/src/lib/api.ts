import type { User } from '@repo/types';

export const API_BASE = '/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

/**
 * Standardized fetch wrapper that includes credentials and json headers.
 */
export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  const body = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !body.success) {
    throw new Error(body.message || 'API request failed');
  }

  // Handle case where body.data might be undefined, though technically 
  // success true responses should have data or null
  return body.data as T;
}

export const authApi = {
  login: (credentials: Record<string, string>) => 
    apiFetch<{ user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
  
  register: (data: Record<string, string>) =>
    apiFetch<{ user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  logout: () => 
    apiFetch<null>('/auth/logout', {
      method: 'POST',
    }),

  me: () =>
    apiFetch<{ user: User }>('/auth/me', {
      method: 'GET',
    }),
};
