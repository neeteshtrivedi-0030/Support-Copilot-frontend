'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { initializeAuth, setCredentials, logout as logoutAction } from '../store/slices/authSlice';
import { authService } from '../services/auth.service';
import { LoginPayload, RegisterPayload } from '../types';

export function useAuth() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const auth = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  const login = async (payload: LoginPayload) => {
    const data = await authService.login(payload);
    dispatch(
      setCredentials({
        user: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      })
    );
    router.push('/dashboard');
    return data;
  };

  const register = async (payload: RegisterPayload) => {
    const data = await authService.register(payload);
    dispatch(
      setCredentials({
        user: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      })
    );
    router.push('/dashboard');
    return data;
  };

  const logout = async () => {
    await authService.logout();
    dispatch(logoutAction());
    router.push('/login');
  };

  const isAdmin = auth.user?.role === 'admin';
  const isEmployee = auth.user?.role === 'employee';

  return {
    ...auth,
    login,
    register,
    logout,
    isAdmin,
    isEmployee,
  };
}
