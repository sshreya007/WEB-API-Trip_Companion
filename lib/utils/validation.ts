import { RegisterFormData, LoginFormData } from '@/types/auth.types';

export const validateRegisterForm = (data: RegisterFormData): string | null => {
  if (!data.firstName.trim()) return 'First name is required';
  if (!data.lastName.trim()) return 'Last name is required';
  if (!data.username.trim()) return 'Username is required';
  if (data.username.length < 3) return 'Username must be at least 3 characters';
  if (!data.email.trim()) return 'Email is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return 'Invalid email format';
  if (!data.password) return 'Password is required';
  if (data.password.length < 6) return 'Password must be at least 6 characters';
  if (data.password !== data.confirmPassword) return 'Passwords do not match';
  return null;
};

export const validateLoginForm = (data: LoginFormData): string | null => {
  if (!data.email.trim()) return 'Email is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return 'Invalid email format';
  if (!data.password) return 'Password is required';
  return null;
};