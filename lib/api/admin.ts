import api from './axios';
import { User } from '@/types/auth.types';

// Define admin-specific types inline (no need for separate file)
interface CreateUserData {
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

interface UpdateUserData {
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

interface AdminAPIResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export const adminAPI = {
  // Get all users
  getAllUsers: async (): Promise<AdminAPIResponse<User[]>> => {
    try {
      const response = await api.get<any>('/admin/users');
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error: any) {
      console.error('❌ Get all users error:', error.response?.data);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch users',
      };
    }
  },

  // Get user by ID
  getUserById: async (id: string): Promise<AdminAPIResponse<User>> => {
    try {
      const response = await api.get<any>(`/admin/users/${id}`);
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error: any) {
      console.error('❌ Get user error:', error.response?.data);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch user',
      };
    }
  },

  // Create user
  createUser: async (userData: CreateUserData, image?: File): Promise<AdminAPIResponse<User>> => {
    try {
      const formData = new FormData();
      
      // Add all user data to FormData
      formData.append('firstName', userData.firstName);
      formData.append('lastName', userData.lastName);
      formData.append('username', userData.username);
      formData.append('email', userData.email);
      formData.append('password', userData.password);
      formData.append('role', userData.role);
      
      if (userData.gender) formData.append('gender', userData.gender);
      if (userData.age) formData.append('age', userData.age.toString());
      if (userData.bio) formData.append('bio', userData.bio);
      if (image) formData.append('image', image);

      const response = await api.post<any>('/admin/users', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return {
        success: true,
        message: response.data.message,
        data: response.data.data || response.data,
      };
    } catch (error: any) {
      console.error('❌ Create user error:', error.response?.data);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to create user',
      };
    }
  },

  // Update user
  updateUser: async (id: string, userData: UpdateUserData, image?: File): Promise<AdminAPIResponse<User>> => {
    try {
      const formData = new FormData();
      
      // Add only provided fields
      if (userData.firstName) formData.append('firstName', userData.firstName);
      if (userData.lastName) formData.append('lastName', userData.lastName);
      if (userData.username) formData.append('username', userData.username);
      if (userData.email) formData.append('email', userData.email);
      if (userData.password) formData.append('password', userData.password);
      if (userData.role) formData.append('role', userData.role);
      if (userData.gender) formData.append('gender', userData.gender);
      if (userData.age) formData.append('age', userData.age.toString());
      if (userData.bio) formData.append('bio', userData.bio);
      if (image) formData.append('image', image);

      const response = await api.put<any>(`/admin/users/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return {
        success: true,
        message: response.data.message,
        data: response.data.data || response.data,
      };
    } catch (error: any) {
      console.error('❌ Update user error:', error.response?.data);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update user',
      };
    }
  },

  // Delete user
  deleteUser: async (id: string): Promise<AdminAPIResponse<void>> => {
    try {
      const response = await api.delete<any>(`/admin/users/${id}`);
      return {
        success: true,
        message: response.data.message,
      };
    } catch (error: any) {
      console.error('❌ Delete user error:', error.response?.data);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete user',
      };
    }
  },
};

// Export types for use in components
export type { CreateUserData, UpdateUserData, AdminAPIResponse };