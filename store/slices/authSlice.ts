import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User } from '../../types/auth.types';
import { storage } from '../../utils/storage';

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    initializeAuth: (state) => {
      const token = storage.getToken();
      const user = storage.getUser();
      const refreshToken = storage.getRefreshToken();
      if (token && user) {
        state.token = token;
        state.user = user;
        state.refreshToken = refreshToken;
        state.isAuthenticated = true;
      }
      state.isLoading = false;
    },
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; accessToken: string; refreshToken?: string }>
    ) => {
      const { user, accessToken, refreshToken } = action.payload;
      state.user = user;
      state.token = accessToken;
      state.refreshToken = refreshToken || null;
      state.isAuthenticated = true;
      state.isLoading = false;

      storage.setToken(accessToken);
      storage.setUser(user);
      if (refreshToken) {
        storage.setRefreshToken(refreshToken);
      }
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      storage.setUser(action.payload);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      storage.clearAuth();
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { initializeAuth, setCredentials, setUser, logout, setLoading } = authSlice.actions;

export default authSlice.reducer;
