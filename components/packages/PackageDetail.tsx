'use client';

import { Package } from '@/types/package.types';

interface PackageDetailProps {
  package: Package;
}

export default function PackageDetail({ package: pkg }: PackageDetailProps) {
  const renderStars = (rating: number) => {
    return '⭐'.repeat(Math.floor(rating));
  };

  return (
    <div className="package-detail-container">
      {/* Hero Image */}
      <div className="package-detail-hero">
        <img 
          src={pkg.coverImage} 
          alt={pkg.title}
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/1200x400?text=No+Image';
          }}
        />
        <div className="package-detail-hero-overlay">
          <h1>{pkg.title}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', fontSize: '16px' }}>
            <span>📍 {pkg.destination}, {pkg.country}</span>
            <span>📅 {pkg.duration.days} Days / {pkg.duration.nights} Nights</span>
            <span>{renderStars(pkg.rating.average)} ({pkg.rating.count} reviews)</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="package-detail-content">
        {/* Description */}
        <div className="package-detail-section">
          <h2>About This Package</h2>
          <p style={{ fontSize: '15px', lineHeight: '1.8', color: '#64748b' }}>
            {pkg.description}
          </p>
        </div>

        {/* Highlights */}
        <div className="package-detail-section">
          <h2>✨ Highlights</h2>
          <div className="package-highlights">
            {pkg.highlights.map((highlight, index) => (
              <div key={index} className="package-highlight-item">
                <span style={{ fontSize: '20px' }}>✓</span>
                <span>{highlight}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Itinerary */}
        {pkg.itinerary && pkg.itinerary.length > 0 && (
          <div className="package-detail-section">
            <h2>📋 Day-by-Day Itinerary</h2>
            <div className="package-itinerary">
              {pkg.itinerary.map((day) => (
                <div key={day.day} className="itinerary-day">
                  <div className="itinerary-day-number">
                    Day {day.day}
                  </div>
                  <div className="itinerary-day-content">
                    <h4 className="itinerary-day-title">{day.title}</h4>
                    <p className="itinerary-day-description">{day.description}</p>
                    {day.activities && day.activities.length > 0 && (
                      <div className="itinerary-activities">
                        {day.activities.map((activity, idx) => (
                          <span key={idx} className="itinerary-activity">
                            {activity}
                          </span>
                        ))}
                      </div>
                    )}
                    {day.meals && day.meals.length > 0 && (
                      <div style={{ marginTop: '12px', fontSize: '13px', color: '#64748b' }}>
                        🍽️ Meals: {day.meals.join(', ')}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* What's Included */}
        <div className="package-detail-section">
          <h2>✅ What's Included</h2>
          <div style={{ display: 'grid', gap: '12px' }}>
            {pkg.includes.map((item, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px' }}>
                <span style={{ color: '#10b981', fontSize: '20px' }}>✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* What's Excluded */}
        {pkg.excludes && pkg.excludes.length > 0 && (
          <div className="package-detail-section">
            <h2>❌ What's Not Included</h2>
            <div style={{ display: 'grid', gap: '12px' }}>
              {pkg.excludes.map((item, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px' }}>
                  <span style={{ color: '#ef4444', fontSize: '20px' }}>✗</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Accommodation */}
        {pkg.accommodation && (
          <div className="package-detail-section">
            <h2>🏨 Accommodation</h2>
            <div style={{ 
              background: 'rgba(13, 148, 136, 0.05)', 
              padding: '20px', 
              borderRadius: '16px' 
            }}>
              <h4 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 12px 0' }}>
                {pkg.accommodation.hotelName}
              </h4>
              <div style={{ display: 'flex', gap: '24px', fontSize: '14px', color: '#64748b' }}>
                <span>⭐ {pkg.accommodation.hotelRating} Star Hotel</span>
                <span>🛏️ {pkg.accommodation.roomType}</span>
              </div>
            </div>
          </div>
        )}

        {/* Cancellation Policy */}
        {pkg.cancellationPolicy && (
          <div className="package-detail-section">
            <h2>📜 Cancellation Policy</h2>
            <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.8' }}>
              {pkg.cancellationPolicy}
            </p>
          </div>
        )}

        {/* Terms & Conditions */}
        {pkg.termsAndConditions && (
          <div className="package-detail-section">
            <h2>📄 Terms & Conditions</h2>
            <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.8' }}>
              {pkg.termsAndConditions}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}