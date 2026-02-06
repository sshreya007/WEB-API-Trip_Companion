import api from './axios';
import { API_ENDPOINTS } from './endpoints';
import { RegisterFormData, LoginFormData, AuthResponse, User } from '@/types/auth.types';

// Define API response structure (matches your backend)
interface APIResponse {
  success: boolean;
  message?: string;
  token?: string;  // Token at top level
  user?: User;     // User at top level
  data?: {         // Or nested in data
    token: string;
    user: User;
  };
}

export const authAPI = {
  // Register
  register: async (data: Omit<RegisterFormData, 'confirmPassword'>): Promise<AuthResponse> => {
    try {
      const response = await api.post<APIResponse>(API_ENDPOINTS.AUTH.REGISTER, data);
      
      // Handle both response formats
      const responseData = response.data.data || {
        token: response.data.token || '',
        user: response.data.user!
      };
      
      return {
        success: true,
        message: response.data.message,
        data: responseData,
      };
    } catch (error: any) {
      console.error('❌ Register error:', error.response?.data);
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed',
      };
    }
  },

  // Login
  login: async (data: LoginFormData): Promise<AuthResponse> => {
    try {
      console.log('🔵 Login attempt - API endpoint:', API_ENDPOINTS.AUTH.LOGIN);
      console.log('🔵 Login attempt - data:', data);
      
      const response = await api.post<APIResponse>(API_ENDPOINTS.AUTH.LOGIN, data);
      
      console.log('✅ Login response:', response.data);
      
      // ✅ Handle backend format: { success, token, user }
      // Convert to frontend format: { success, data: { token, user } }
      const responseData = response.data.data || {
        token: response.data.token!,
        user: response.data.user!
      };
      
      console.log('✅ Converted response data:', responseData);
      
      return {
        success: true,
        data: responseData,
      };
    } catch (error: any) {
      console.error('❌ Login error:', error);
      console.error('❌ Login error.response:', error.response?.data);
      
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Login failed',
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