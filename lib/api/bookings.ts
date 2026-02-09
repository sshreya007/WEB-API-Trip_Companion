import api from './axios';
import { Booking, CreateBookingData, BookingFilter, BookingsResponse, BookingStats } from '@/types/booking.types';

interface APIResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: any;
}

export const bookingsAPI = {
  // Create booking
  createBooking: async (bookingData: CreateBookingData): Promise<APIResponse<Booking>> => {
    try {
      const response = await api.post<any>('/bookings', bookingData);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error: any) {
      console.error('❌ Create booking error:', error.response?.data);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to create booking'
      };
    }
  },

  // Get user bookings
  getUserBookings: async (filters?: BookingFilter): Promise<BookingsResponse> => {
    try {
      const params = new URLSearchParams();
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            params.append(key, value.toString());
          }
        });
      }

      const response = await api.get<any>(`/bookings?${params.toString()}`);
      
      return {
        success: true,
        data: response.data.data || [],
        pagination: response.data.pagination || { page: 1, limit: 10, total: 0, pages: 0 }
      };
    } catch (error: any) {
      console.error('❌ Get bookings error:', error.response?.data);
      return {
        success: false,
        data: [],
        pagination: { page: 1, limit: 10, total: 0, pages: 0 }
      };
    }
  },

  // Get booking by ID
  getBookingById: async (id: string): Promise<APIResponse<Booking>> => {
    try {
      const response = await api.get<any>(`/bookings/${id}`);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error: any) {
      console.error('❌ Get booking error:', error.response?.data);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch booking'
      };
    }
  },

  // Get booking by reference
  getBookingByReference: async (reference: string): Promise<APIResponse<Booking>> => {
    try {
      const response = await api.get<any>(`/bookings/reference/${reference}`);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error: any) {
      console.error('❌ Get booking by reference error:', error.response?.data);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch booking'
      };
    }
  },

  // Cancel booking - ✅ FIXED with proper typing
cancelBooking: async (id: string, reason: string): Promise<APIResponse<Booking>> => {
  try {
    const response = await api.delete<any>(`/bookings/${id}`, {
      data: { reason }
    } as any); // Add type assertion
    return {
      success: true,
      data: response.data.data,
      message: response.data.message
    };
  } catch (error: any) {
    console.error('❌ Cancel booking error:', error.response?.data);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to cancel booking'
    };
  }
},

  // Add review
  addReview: async (id: string, rating: number, comment: string): Promise<APIResponse<Booking>> => {
    try {
      const response = await api.post<any>(`/bookings/${id}/review`, {
        rating,
        comment
      });
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error: any) {
      console.error('❌ Add review error:', error.response?.data);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to add review'
      };
    }
  },

  // Get booking statistics
  getBookingStats: async (): Promise<APIResponse<BookingStats>> => {
    try {
      const response = await api.get<any>('/bookings/stats');
      return {
        success: true,
        data: response.data.data
      };
    } catch (error: any) {
      console.error('❌ Get booking stats error:', error.response?.data);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch statistics'
      };
    }
  }
};