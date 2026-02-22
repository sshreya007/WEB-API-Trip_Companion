import api from './axios';

interface APIResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export const passwordResetAPI = {
  // Request password reset
  forgotPassword: async (email: string): Promise<APIResponse<void>> => {
    try {
      const response = await api.post<any>('/auth/forgot-password', { email });
      return {
        success: true,
        message: response.data.message
      };
    } catch (error: any) {
      console.error('❌ Forgot password error:', error.response?.data);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to send reset email'
      };
    }
  },

  // Reset password with token
  resetPassword: async (token: string, newPassword: string): Promise<APIResponse<void>> => {
    try {
      const response = await api.post<any>('/auth/reset-password', {
        token,
        newPassword
      });
      return {
        success: true,
        message: response.data.message
      };
    } catch (error: any) {
      console.error('❌ Reset password error:', error.response?.data);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to reset password'
      };
    }
  }
};