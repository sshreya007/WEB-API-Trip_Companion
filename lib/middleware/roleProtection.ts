import { User } from '@/types/auth.types';

export const isAdmin = (user: User | null): boolean => {
  return user?.role === 'admin';
};

export const isUser = (user: User | null): boolean => {
  return user?.role === 'user';
};

export const requireAuth = (user: User | null): boolean => {
  return !!user;
};

export const requireAdmin = (user: User | null): boolean => {
  return requireAuth(user) && isAdmin(user);
};