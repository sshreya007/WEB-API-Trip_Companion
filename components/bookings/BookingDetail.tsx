'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Booking } from '@/types/booking.types';
import { bookingsAPI } from '@/lib/api/bookings';

interface BookingDetailProps {
  booking: Booking;
  onUpdate: () => void;
}

export default function BookingDetail({ booking, onUpdate }: BookingDetailProps) {
  const router = useRouter();
  const [showReview, setShowReview] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const packageData = typeof booking.packageId === 'object' ? booking.packageId : null;

  const handleCancelBooking = async () => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    const reason = prompt('Please provide a reason for cancellation:');
    if (!reason) return;

    setLoading(true);
    const result = await bookingsAPI.cancelBooking(booking._id, reason);
    setLoading(false);

    if (result.success) {
      alert('Booking cancelled successfully');
      onUpdate();
    } else {
      alert(result.error || 'Failed to cancel booking');
    }
  };

  const handleSubmitReview = async () => {
    if (!comment.trim()) {
      alert('Please write a review comment');
      return;
    }

    setLoading(true);
    const result = await bookingsAPI.addReview(booking._id, rating, comment);
    setLoading(false);

    if (result.success) {
      alert('Review submitted successfully!');
      setShowReview(false);
      onUpdate();
    } else {
      alert(result.error || 'Failed to submit review');
    }
  };

  return (
    <div className="booking-detail-container">
      {/* Header */}
      <div className="booking-detail-header">
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '800', margin: '0 0 8px 0' }}>
            {packageData?.title || 'Booking Details'}
          </h1>
          <p style={{ fontSize: '16px', color: '#64748b', margin: 0 }}>
            Booking Reference: <strong>{booking.bookingReference}</strong>
          </p>
        </div>
        <span className={`booking-status ${booking.status}`} style={{ fontSize: '14px', padding: '8px 16px' }}>
          {booking.status}
        </span>
      </div>

      {/* Package Info */}
      {packageData && (
        <div className="booking-detail-section">
          <h3>Package Information</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div>
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>Destination</p>
              <p style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: 0 }}>
                {packageData.destination}, {packageData.country}
              </p>
            </div>
            <div>
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>Duration</p>
              <p style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: 0 }}>
                {packageData.duration.days} Days / {packageData.duration.nights} Nights
              </p>
            </div>
            <div>
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>Category</p>
              <p style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: 0, textTransform: 'capitalize' }}>
                {packageData.category}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Booking Details */}
      <div className="booking-detail-section">
        <h3>Booking Details</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>Travel Date</p>
            <p style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: 0 }}>
              {formatDate(booking.travelDate)}
            </p>
          </div>
          <div>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>Booking Date</p>
            <p style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: 0 }}>
              {formatDate(booking.bookingDate)}
            </p>
          </div>
          <div>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>Total Price</p>
            <p style={{ fontSize: '20px', fontWeight: '800', color: '#0d9488', margin: 0 }}>
              ${booking.totalPrice}
            </p>
          </div>
          <div>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>Payment Status</p>
            <p style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: 0, textTransform: 'capitalize' }}>
              {booking.paymentStatus}
            </p>
          </div>
        </div>
      </div>

      {/* Travelers */}
      <div className="booking-detail-section">
        <h3>Travelers ({booking.numberOfTravelers.adults} Adults, {booking.numberOfTravelers.children} Children)</h3>
        <div className="traveler-list">
          {booking.travelers.map((traveler, index) => (
            <div key={index} className="traveler-card">
              <h4>Traveler {index + 1}</h4>
              <div className="traveler-info">
                <div className="traveler-info-item">
                  <div className="traveler-info-label">Name</div>
                  <div className="traveler-info-value">{traveler.firstName} {traveler.lastName}</div>
                </div>
                <div className="traveler-info-item">
                  <div className="traveler-info-label">Age</div>
                  <div className="traveler-info-value">{traveler.age} years</div>
                </div>
                <div className="traveler-info-item">
                  <div className="traveler-info-label">Gender</div>
                  <div className="traveler-info-value">{traveler.gender}</div>
                </div>
                <div className="traveler-info-item">
                  <div className="traveler-info-label">Email</div>
                  <div className="traveler-info-value">{traveler.email}</div>
                </div>
                <div className="traveler-info-item">
                  <div className="traveler-info-label">Phone</div>
                  <div className="traveler-info-value">{traveler.phone}</div>
                </div>
                {traveler.passportNumber && (
                  <div className="traveler-info-item">
                    <div className="traveler-info-label">Passport</div>
                    <div className="traveler-info-value">{traveler.passportNumber}</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="booking-detail-section">
        <h3>Emergency Contact</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>Name</p>
            <p style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: 0 }}>
              {booking.emergencyContact.name}
            </p>
          </div>
          <div>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>Phone</p>
            <p style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: 0 }}>
              {booking.emergencyContact.phone}
            </p>
          </div>
          <div>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>Relation</p>
            <p style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: 0 }}>
              {booking.emergencyContact.relation}
            </p>
          </div>
        </div>
      </div>

      {/* Special Requests */}
      {booking.specialRequests && (
        <div className="booking-detail-section">
          <h3>Special Requests</h3>
          <p style={{ fontSize: '15px', color: '#64748b', lineHeight: '1.8' }}>
            {booking.specialRequests}
          </p>
        </div>
      )}

      {/* Review Section */}
      {booking.status === 'completed' && (
        <div className="booking-detail-section">
          <h3>Review & Rating</h3>
          {booking.review ? (
            <div className="review-section">
              <div style={{ marginBottom: '12px' }}>
                <span style={{ fontSize: '24px' }}>{'⭐'.repeat(booking.review.rating)}</span>
              </div>
              <p style={{ fontSize: '15px', color: '#0f172a', lineHeight: '1.8', margin: '0 0 12px 0' }}>
                {booking.review.comment}
              </p>
              <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                Reviewed on {formatDate(booking.review.reviewDate)}
              </p>
            </div>
          ) : (
            <div className="review-section">
              {!showReview ? (
                <button
                  onClick={() => setShowReview(true)}
                  style={{
                    padding: '12px 24px',
                    background: 'linear-gradient(135deg, #0d9488 0%, #06b6d4 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  Write a Review
                </button>
              ) : (
                <div>
                  <div className="star-rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className="star"
                        onClick={() => setRating(star)}
                        style={{
                          cursor: 'pointer',
                          fontSize: '32px',
                          color: star <= rating ? '#fbbf24' : '#e5e7eb'
                        }}
                      >
                        ⭐
                      </span>
                    ))}
                  </div>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your experience..."
                    rows={4}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid rgba(13, 148, 136, 0.15)',
                      borderRadius: '12px',
                      fontSize: '14px',
                      marginBottom: '16px'
                    }}
                  />
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      onClick={handleSubmitReview}
                      disabled={loading}
                      style={{
                        padding: '12px 24px',
                        background: 'linear-gradient(135deg, #0d9488 0%, #06b6d4 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        fontWeight: '700',
                        cursor: 'pointer'
                      }}
                    >
                      {loading ? 'Submitting...' : 'Submit Review'}
                    </button>
                    <button
                      onClick={() => setShowReview(false)}
                      style={{
                        padding: '12px 24px',
                        background: 'white',
                        color: '#64748b',
                        border: '2px solid #e5e7eb',
                        borderRadius: '12px',
                        fontWeight: '700',
                        cursor: 'pointer'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
        <button
          onClick={() => router.push('/bookings')}
          style={{
            flex: 1,
            padding: '14px',
            background: 'white',
            border: '2px solid #0d9488',
            borderRadius: '14px',
            color: '#0d9488',
            fontWeight: '700',
            cursor: 'pointer'
          }}
        >
          Back to Bookings
        </button>

        {booking.status === 'pending' && (
          <button
            onClick={handleCancelBooking}
            disabled={loading}
            style={{
              flex: 1,
              padding: '14px',
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              border: 'none',
              borderRadius: '14px',
              color: 'white',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            {loading ? 'Cancelling...' : 'Cancel Booking'}
          </button>
        )}
      </div>
    </div>
  );
}