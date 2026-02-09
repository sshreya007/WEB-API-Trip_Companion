'use client';

import { useRouter } from 'next/navigation';
import { Booking } from '@/types/booking.types';

interface BookingCardProps {
  booking: Booking;
}

export default function BookingCard({ booking }: BookingCardProps) {
  const router = useRouter();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'confirmed';
      case 'pending':
        return 'pending';
      case 'cancelled':
        return 'cancelled';
      case 'completed':
        return 'completed';
      default:
        return 'pending';
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const packageData = typeof booking.packageId === 'object' ? booking.packageId : null;

  return (
    <div className="booking-card" onClick={() => router.push(`/bookings/${booking._id}`)}>
      <div className="booking-card-header">
        <div className="booking-card-left">
          <h3>{packageData?.title || 'Package Booking'}</h3>
          <p className="booking-reference">
            Booking Ref: <strong>{booking.bookingReference}</strong>
          </p>
        </div>
        <span className={`booking-status ${getStatusColor(booking.status)}`}>
          {booking.status}
        </span>
      </div>

      <div className="booking-card-info">
        <div className="booking-info-item">
          <div className="booking-info-icon">📅</div>
          <div className="booking-info-text">
            <div className="booking-info-label">Travel Date</div>
            <div className="booking-info-value">{formatDate(booking.travelDate)}</div>
          </div>
        </div>

        <div className="booking-info-item">
          <div className="booking-info-icon">👥</div>
          <div className="booking-info-text">
            <div className="booking-info-label">Travelers</div>
            <div className="booking-info-value">
              {booking.numberOfTravelers.adults} Adults, {booking.numberOfTravelers.children} Children
            </div>
          </div>
        </div>

        <div className="booking-info-item">
          <div className="booking-info-icon">💰</div>
          <div className="booking-info-text">
            <div className="booking-info-label">Total Price</div>
            <div className="booking-info-value">${booking.totalPrice}</div>
          </div>
        </div>

        <div className="booking-info-item">
          <div className="booking-info-icon">💳</div>
          <div className="booking-info-text">
            <div className="booking-info-label">Payment</div>
            <div className="booking-info-value">{booking.paymentStatus}</div>
          </div>
        </div>
      </div>

      <div className="booking-card-actions">
        <button
          className="booking-action-button primary"
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/bookings/${booking._id}`);
          }}
        >
          View Details
        </button>

        {booking.status === 'pending' && (
          <button
            className="booking-action-button danger"
            onClick={(e) => {
              e.stopPropagation();
              // Handle cancel - will be in detail page
            }}
          >
            Cancel Booking
          </button>
        )}

        {booking.status === 'completed' && !booking.review && (
          <button
            className="booking-action-button primary"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/bookings/${booking._id}#review`);
            }}
          >
            Add Review
          </button>
        )}
      </div>
    </div>
  );
}