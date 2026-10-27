import { AUTH_STORAGE_KEY, REFRESH_STORAGE_KEY, USER_STORAGE_KEY } from './constants';
import { User } from '../types';

export const storage = {
  getToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    const token = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!token || token === 'undefined' || token === 'null') return null;
    return token;
  },

  setToken: (token: string): void => {
    if (typeof window === 'undefined' || !token || token === 'undefined' || token === 'null')
      return;
    localStorage.setItem(AUTH_STORAGE_KEY, token);
    // Also set as cookie for Next.js edge middleware
    document.cookie = `auth_token=${encodeURIComponent(token)}; path=/; max-age=86400; SameSite=Lax`;
  },

  getRefreshToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    const token = localStorage.getItem(REFRESH_STORAGE_KEY);
    if (!token || token === 'undefined' || token === 'null') return null;
    return token;
  },

  setRefreshToken: (token: string): void => {
    if (typeof window === 'undefined' || !token || token === 'undefined' || token === 'null')
      return;
    localStorage.setItem(REFRESH_STORAGE_KEY, token);
  },

  getUser: (): User | null => {
    if (typeof window === 'undefined') return null;
    const item = localStorage.getItem(USER_STORAGE_KEY);
    if (!item || item === 'undefined' || item === 'null') return null;
    try {
      return JSON.parse(item) as User;
    } catch {
      return null;
    }
  },

  setUser: (user: User): void => {
    if (typeof window === 'undefined' || !user) return;
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    // Also set user role cookie for role-based edge middleware
    if (user.role) {
      document.cookie = `user_role=${encodeURIComponent(user.role)}; path=/; max-age=86400; SameSite=Lax`;
    }
  },

  clearAuth: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(REFRESH_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    document.cookie = 'auth_token=; path=/; max-age=0; SameSite=Lax';
    document.cookie = 'user_role=; path=/; max-age=0; SameSite=Lax';
  },
};
