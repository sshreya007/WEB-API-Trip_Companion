import api from './axios';
import { Booking, BookingFilter, BookingsResponse } from '@/types/booking.types';

interface APIResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export const adminBookingsAPI = {
  // Get all bookings (admin)
  getAllBookings: async (filters?: BookingFilter): Promise<BookingsResponse> => {
    try {
      const params = new URLSearchParams();
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            params.append(key, value.toString());
          }
        });
      }

      const response = await api.get<any>(`/bookings/admin/all?${params.toString()}`);
      
      return {
        success: true,
        data: response.data.data || [],
        pagination: response.data.pagination || { page: 1, limit: 10, total: 0, pages: 0 }
      };
    } catch (error: any) {
      console.error('❌ Get all bookings error:', error.response?.data);
      return {
        success: false,
        data: [],
        pagination: { page: 1, limit: 10, total: 0, pages: 0 }
      };
    }
  },

  // Confirm booking
  confirmBooking: async (id: string): Promise<APIResponse<Booking>> => {
    try {
      const response = await api.patch<any>(`/bookings/${id}/confirm`);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error: any) {
      console.error('❌ Confirm booking error:', error.response?.data);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to confirm booking'
      };
    }
  },

  // Complete booking
  completeBooking: async (id: string): Promise<APIResponse<Booking>> => {
    try {
      const response = await api.patch<any>(`/bookings/${id}/complete`);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error: any) {
      console.error('❌ Complete booking error:', error.response?.data);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to complete booking'
      };
    }
  }
};