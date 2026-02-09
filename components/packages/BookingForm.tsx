'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Package } from '@/types/package.types';
import { bookingsAPI } from '@/lib/api/bookings';
import { CreateBookingData, Traveler } from '@/types/booking.types';

interface BookingFormProps {
  package: Package;
}

export default function BookingForm({ package: pkg }: BookingFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    travelDate: '',
    adults: 1,
    children: 0,
    specialRequests: '',
    discountCode: ''
  });

  const [travelers, setTravelers] = useState<Traveler[]>([
    {
      firstName: '',
      lastName: '',
      age: 0,
      gender: 'Male' as 'Male' | 'Female' | 'Other',
      email: '',
      phone: '',
      passportNumber: ''
    }
  ]);

  const [emergencyContact, setEmergencyContact] = useState({
    name: '',
    phone: '',
    relation: ''
  });

  // Calculate total price
  const calculateTotal = () => {
    const basePrice = pkg.price.amount;
    const adultPrice = basePrice * formData.adults;
    const childPrice = (basePrice * 0.5) * formData.children; // 50% for children
    return adultPrice + childPrice;
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'adults' || name === 'children' ? parseInt(value) || 0 : value
    }));
  };

  const handleTravelerChange = (index: number, field: keyof Traveler, value: string | number) => {
    setTravelers(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addTraveler = () => {
    setTravelers(prev => [...prev, {
      firstName: '',
      lastName: '',
      age: 0,
      gender: 'Male',
      email: '',
      phone: '',
      passportNumber: ''
    }]);
  };

  const removeTraveler = (index: number) => {
    if (travelers.length > 1) {
      setTravelers(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate
    if (!formData.travelDate) {
      setError('Please select a travel date');
      setLoading(false);
      return;
    }

    if (travelers.length < formData.adults + formData.children) {
      setError('Please add traveler details for all passengers');
      setLoading(false);
      return;
    }

    // Validate each traveler
    for (let i = 0; i < travelers.length; i++) {
      const t = travelers[i];
      if (!t.firstName || !t.lastName || !t.email || !t.phone || !t.age) {
        setError(`Please complete all fields for traveler ${i + 1}`);
        setLoading(false);
        return;
      }
    }

    if (!emergencyContact.name || !emergencyContact.phone || !emergencyContact.relation) {
      setError('Please provide emergency contact details');
      setLoading(false);
      return;
    }

    const bookingData: CreateBookingData = {
      packageId: pkg._id,
      travelDate: new Date(formData.travelDate),
      numberOfTravelers: {
        adults: formData.adults,
        children: formData.children
      },
      travelers: travelers.slice(0, formData.adults + formData.children),
      emergencyContact,
      specialRequests: formData.specialRequests,
      discountCode: formData.discountCode
    };

    try {
      const result = await bookingsAPI.createBooking(bookingData);

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push(`/bookings/${result.data?._id}`);
        }, 2000);
      } else {
        setError(result.error || 'Failed to create booking');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="booking-form-container">
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ fontSize: '60px', marginBottom: '20px' }}>✅</div>
          <h3 style={{ color: '#10b981', marginBottom: '12px' }}>Booking Successful!</h3>
          <p style={{ color: '#64748b' }}>Redirecting to booking details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-form-container">
      <form onSubmit={handleSubmit} className="booking-form">
        <h3>Book This Package</h3>

        {error && (
          <div style={{
            backgroundColor: '#fee',
            color: '#c33',
            padding: '12px',
            borderRadius: '12px',
            marginBottom: '20px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        {/* Price Summary */}
        <div className="price-summary">
          <div className="price-row">
            <span>Adults ({formData.adults} x ${pkg.price.amount})</span>
            <span>${pkg.price.amount * formData.adults}</span>
          </div>
          {formData.children > 0 && (
            <div className="price-row">
              <span>Children ({formData.children} x ${pkg.price.amount * 0.5})</span>
              <span>${pkg.price.amount * 0.5 * formData.children}</span>
            </div>
          )}
          <div className="price-row total">
            <span>Total Price</span>
            <span>${calculateTotal()}</span>
          </div>
        </div>

        {/* Travel Date */}
        <div className="form-group">
          <label>Travel Date *</label>
          <input
            type="date"
            name="travelDate"
            value={formData.travelDate}
            onChange={handleFormChange}
            min={new Date().toISOString().split('T')[0]}
            max={new Date(pkg.availability.endDate).toISOString().split('T')[0]}
            required
          />
        </div>

        {/* Number of Travelers */}
        <div className="form-row">
          <div className="form-group">
            <label>Adults *</label>
            <input
              type="number"
              name="adults"
              value={formData.adults}
              onChange={handleFormChange}
              min="1"
              max="10"
              required
            />
          </div>
          <div className="form-group">
            <label>Children</label>
            <input
              type="number"
              name="children"
              value={formData.children}
              onChange={handleFormChange}
              min="0"
              max="10"
            />
          </div>
        </div>

        {/* Traveler Details */}
        <h4 style={{ fontSize: '18px', fontWeight: '700', marginTop: '24px', marginBottom: '16px' }}>
          Traveler Details
        </h4>

        {travelers.slice(0, formData.adults + formData.children).map((traveler, index) => (
          <div key={index} style={{
            background: 'rgba(13, 148, 136, 0.05)',
            padding: '20px',
            borderRadius: '16px',
            marginBottom: '16px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h5 style={{ fontSize: '16px', fontWeight: '700', margin: 0 }}>
                Traveler {index + 1} {index < formData.adults ? '(Adult)' : '(Child)'}
              </h5>
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeTraveler(index)}
                  style={{
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  Remove
                </button>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>First Name *</label>
                <input
                  type="text"
                  value={traveler.firstName}
                  onChange={(e) => handleTravelerChange(index, 'firstName', e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Last Name *</label>
                <input
                  type="text"
                  value={traveler.lastName}
                  onChange={(e) => handleTravelerChange(index, 'lastName', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Age *</label>
                <input
                  type="number"
                  value={traveler.age || ''}
                  onChange={(e) => handleTravelerChange(index, 'age', parseInt(e.target.value))}
                  min="1"
                  max="150"
                  required
                />
              </div>
              <div className="form-group">
                <label>Gender *</label>
                <select
                  value={traveler.gender}
                  onChange={(e) => handleTravelerChange(index, 'gender', e.target.value)}
                  required
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={traveler.email}
                  onChange={(e) => handleTravelerChange(index, 'email', e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone *</label>
                <input
                  type="tel"
                  value={traveler.phone}
                  onChange={(e) => handleTravelerChange(index, 'phone', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Passport Number (Optional)</label>
              <input
                type="text"
                value={traveler.passportNumber || ''}
                onChange={(e) => handleTravelerChange(index, 'passportNumber', e.target.value)}
              />
            </div>
          </div>
        ))}

        {travelers.length < formData.adults + formData.children && (
          <button
            type="button"
            onClick={addTraveler}
            style={{
              width: '100%',
              padding: '12px',
              background: 'white',
              border: '2px dashed #0d9488',
              borderRadius: '12px',
              color: '#0d9488',
              fontWeight: '600',
              cursor: 'pointer',
              marginBottom: '24px'
            }}
          >
            + Add Traveler
          </button>
        )}

        {/* Emergency Contact */}
        <h4 style={{ fontSize: '18px', fontWeight: '700', marginTop: '24px', marginBottom: '16px' }}>
          Emergency Contact
        </h4>

        <div className="form-group">
          <label>Contact Name *</label>
          <input
            type="text"
            value={emergencyContact.name}
            onChange={(e) => setEmergencyContact(prev => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Contact Phone *</label>
            <input
              type="tel"
              value={emergencyContact.phone}
              onChange={(e) => setEmergencyContact(prev => ({ ...prev, phone: e.target.value }))}
              required
            />
          </div>
          <div className="form-group">
            <label>Relation *</label>
            <input
              type="text"
              placeholder="e.g., Spouse, Parent"
              value={emergencyContact.relation}
              onChange={(e) => setEmergencyContact(prev => ({ ...prev, relation: e.target.value }))}
              required
            />
          </div>
        </div>

        {/* Special Requests */}
        <div className="form-group">
          <label>Special Requests (Optional)</label>
          <textarea
            name="specialRequests"
            value={formData.specialRequests}
            onChange={handleFormChange}
            rows={4}
            placeholder="Any dietary requirements, accessibility needs, etc."
          />
        </div>

        {/* Discount Code */}
        <div className="form-group">
          <label>Discount Code (Optional)</label>
          <input
            type="text"
            name="discountCode"
            value={formData.discountCode}
            onChange={handleFormChange}
            placeholder="Enter promo code"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="book-now-button"
          disabled={loading}
        >
          {loading ? 'Processing...' : `Book Now - $${calculateTotal()}`}
        </button>

        <p style={{ fontSize: '12px', color: '#64748b', textAlign: 'center', marginTop: '16px' }}>
          By booking, you agree to our terms and conditions
        </p>
      </form>
    </div>
  );
}