import api from './axios';
import { API_ENDPOINTS } from './endpoints';
import { RegisterFormData, LoginFormData, AuthResponse, User } from '@/types/auth.type';

// Define API response structure
interface APIResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
}

export const authAPI = {
  // Register
  register: async (data: Omit<RegisterFormData, 'confirmPassword'>): Promise<AuthResponse> => {
    try {
      const response = await api.post<APIResponse>(API_ENDPOINTS.AUTH.REGISTER, data);
      return {
        success: true,
        message: response.data.message,
        data: response.data.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed',
      };
    }
  },

  // Login
  login: async (data: LoginFormData): Promise<AuthResponse> => {
    try {
      const response = await api.post<APIResponse>(API_ENDPOINTS.AUTH.LOGIN, data);
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed',
      };
    }
  },

  // Logout
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },
};