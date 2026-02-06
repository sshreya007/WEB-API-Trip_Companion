import { User } from './auth.types';

export interface CreateUserData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  gender?: string;
  age?: number;
  bio?: string;
  profileImageUrl?: string;
}

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  password?: string;
  role?: 'user' | 'admin';
  gender?: string;
  age?: number;
  bio?: string;
  profileImageUrl?: string;
}

export interface AdminAPIResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}