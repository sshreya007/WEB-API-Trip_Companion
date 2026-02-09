export interface Traveler {
  firstName: string;
  lastName: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  passportNumber?: string;
  email: string;
  phone: string;
}

export interface EmergencyContact {
  name: string;
  phone: string;
  relation: string;
}

export interface AddOn {
  name: string;
  price: number;
}

export interface Booking {
  _id: string;
  userId: string;
  packageId: any; // Can be populated with Package
  bookingReference: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  travelers: Traveler[];
  travelDate: Date;
  numberOfTravelers: {
    adults: number;
    children: number;
  };
  totalPrice: number;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  paymentMethod?: string;
  specialRequests?: string;
  emergencyContact: EmergencyContact;
  addOns: AddOn[];
  discount: {
    code?: string;
    amount: number;
  };
  bookingDate: Date;
  cancellationDate?: Date;
  cancellationReason?: string;
  refundAmount?: number;
  review?: {
    rating: number;
    comment: string;
    reviewDate: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBookingData {
  packageId: string;
  travelers: Traveler[];
  travelDate: Date;
  numberOfTravelers: {
    adults: number;
    children: number;
  };
  emergencyContact: EmergencyContact;
  specialRequests?: string;
  addOns?: AddOn[];
  discountCode?: string;
  paymentMethod?: string;
}

export interface BookingFilter {
  status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  startDate?: Date;
  endDate?: Date;
  sortBy?: 'bookingDate' | 'travelDate' | 'totalPrice';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface BookingsResponse {
  success: boolean;
  data: Booking[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface BookingStats {
  totalBookings: number;
  confirmedBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  totalSpent: number;
}