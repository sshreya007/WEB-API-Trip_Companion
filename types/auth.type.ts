export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  gender?: string;
  age?: number;
  profileImageUrl?: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RegisterFormData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: {
    token: string;
    user: User;
  };
  error?: string;
}