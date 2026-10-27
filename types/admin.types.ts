import { User } from './auth.types';

export interface AdminUserListResult {
  items: User[];
  users: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
