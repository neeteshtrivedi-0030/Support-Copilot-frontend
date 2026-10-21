export type UserRole = 'admin' | 'employee';

export type UserDepartment =
  | 'HR'
  | 'IT'
  | 'Finance'
  | 'Engineering'
  | 'Security'
  | 'Legal'
  | 'Operations'
  | 'General'
  | 'Public'
  | string;

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  department: UserDepartment;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  department: UserDepartment;
  role?: UserRole;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data: T;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
