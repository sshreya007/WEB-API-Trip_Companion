'use client';

import BookingCard from './BookingCard';
import { Booking } from '@/types/booking.types';

interface BookingListProps {
  bookings: Booking[];
  loading?: boolean;
}

export default function BookingList({ bookings, loading }: BookingListProps) {
  if (loading) {
    return (
      <div className="packages-loading">
        <div className="loading-spinner"></div>
        <p style={{ fontSize: '18px', fontWeight: '600', color: '#0d9488', margin: 0 }}>
          Loading your bookings...
        </p>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="bookings-empty">
        <div className="bookings-empty-icon">📋</div>
        <h3>No bookings found</h3>
        <p>You haven't made any bookings yet</p>
        <button
          onClick={() => window.location.href = '/packages'}
          style={{
            padding: '14px 32px',
            background: 'linear-gradient(135deg, #0d9488 0%, #06b6d4 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '14px',
            fontWeight: '700',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Browse Packages
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {bookings.map((booking) => (
        <BookingCard key={booking._id} booking={booking} />
      ))}
    </div>
  );
}