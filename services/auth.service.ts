import { apiClient } from './api';
import { ApiResponse, LoginPayload, RegisterPayload, User } from '../types/auth.types';

export interface BackendAuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn?: number;
}

export interface BackendAuthData {
  user: User;
  tokens?: BackendAuthTokens;
  token?: string;
  accessToken?: string;
  refreshToken?: string;
}

export interface AuthSuccessData {
  user: User;
  token: string;
  accessToken: string;
  refreshToken?: string;
}

export const authService = {
  login: async (payload: LoginPayload): Promise<AuthSuccessData> => {
    const response = await apiClient.post<ApiResponse<BackendAuthData>>('/auth/login', payload);
    const resData = response.data;

    if (!resData.success || !resData.data) {
      throw new Error(resData.message || 'Invalid email or password');
    }

    const data = resData.data;
    const accessToken = data.tokens?.accessToken || data.accessToken || data.token;
    const refreshToken = data.tokens?.refreshToken || data.refreshToken;

    if (!accessToken) {
      throw new Error('No access token received from server');
    }

    return {
      user: data.user,
      token: accessToken,
      accessToken,
      refreshToken,
    };
  },

  register: async (payload: RegisterPayload): Promise<AuthSuccessData> => {
    const response = await apiClient.post<ApiResponse<BackendAuthData>>('/auth/register', payload);
    const resData = response.data;

    if (!resData.success || !resData.data) {
      throw new Error(resData.message || 'Registration failed');
    }

    const data = resData.data;
    const accessToken = data.tokens?.accessToken || data.accessToken || data.token;
    const refreshToken = data.tokens?.refreshToken || data.refreshToken;

    if (!accessToken) {
      throw new Error('No access token received from server');
    }

    return {
      user: data.user,
      token: accessToken,
      accessToken,
      refreshToken,
    };
  },

  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // Ignored if session already expired
    }
  },

  refreshToken: async (refreshToken: string): Promise<string> => {
    const response = await apiClient.post<
      ApiResponse<{ tokens?: BackendAuthTokens; token?: string; accessToken?: string }>
    >(
      '/auth/refresh',
      { refreshToken },
      {
        headers: {
          'x-refresh-token': refreshToken,
        },
      }
    );
    const data = response.data.data;
    const newAccessToken = data?.tokens?.accessToken || data?.accessToken || data?.token;
    if (!newAccessToken) {
      throw new Error('Failed to refresh token');
    }
    return newAccessToken;
  },
};
