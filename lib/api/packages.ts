import api from './axios';
import { Package, PackageFilter, PackagesResponse } from '@/types/package.types';

interface APIResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: any;
}

export const packagesAPI = {
  // Get all packages with filters
  getAllPackages: async (filters?: PackageFilter): Promise<PackagesResponse> => {
    try {
      const params = new URLSearchParams();
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            params.append(key, value.toString());
          }
        });
      }

      const response = await api.get<any>(`/packages?${params.toString()}`);
      
      return {
        success: true,
        data: response.data.data || [],
        pagination: response.data.pagination || { page: 1, limit: 10, total: 0, pages: 0 }
      };
    } catch (error: any) {
      console.error('❌ Get packages error:', error.response?.data);
      return {
        success: false,
        data: [],
        pagination: { page: 1, limit: 10, total: 0, pages: 0 }
      };
    }
  },

  // Get package by ID
  getPackageById: async (id: string): Promise<APIResponse<Package>> => {
    try {
      const response = await api.get<any>(`/packages/${id}`);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error: any) {
      console.error('❌ Get package error:', error.response?.data);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch package'
      };
    }
  },

  // Get featured packages
  getFeaturedPackages: async (limit: number = 6): Promise<APIResponse<Package[]>> => {
    try {
      const response = await api.get<any>(`/packages/featured?limit=${limit}`);
      return {
        success: true,
        data: response.data.data || []
      };
    } catch (error: any) {
      console.error('❌ Get featured packages error:', error.response?.data);
      return {
        success: false,
        data: [],
        error: error.response?.data?.message || 'Failed to fetch featured packages'
      };
    }
  },

  // Get packages by category
  getPackagesByCategory: async (category: string, limit: number = 10): Promise<APIResponse<Package[]>> => {
    try {
      const response = await api.get<any>(`/packages/category/${category}?limit=${limit}`);
      return {
        success: true,
        data: response.data.data || []
      };
    } catch (error: any) {
      console.error('❌ Get packages by category error:', error.response?.data);
      return {
        success: false,
        data: [],
        error: error.response?.data?.message || 'Failed to fetch packages'
      };
    }
  },

  // Check package availability
  checkAvailability: async (id: string): Promise<APIResponse<{ available: boolean }>> => {
    try {
      const response = await api.get<any>(`/packages/${id}/availability`);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error: any) {
      console.error('❌ Check availability error:', error.response?.data);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to check availability'
      };
    }
  }
};